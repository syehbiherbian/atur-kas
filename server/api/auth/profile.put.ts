import { z } from 'zod'
import { eq, or, and, ne } from 'drizzle-orm'
import { useDb, users } from '../../db'
import { requireAuth, hashPassword, verifyPassword } from '../../utils/auth'

const updateProfileSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(255),
    email: z.string().email('Email tidak valid').optional().nullable(),
    phone: z.string().min(10, 'Nomor HP minimal 10 digit').max(20).optional().nullable(),
    currentPassword: z.string().optional().nullable(),
    newPassword: z.string().min(6, 'Password baru minimal 6 karakter').optional().nullable(),
}).refine(data => data.email || data.phone, {
    message: 'Email atau nomor HP harus diisi',
})

export default defineEventHandler(async (event) => {
    const method = getMethod(event)

    if (method !== 'PUT') {
        throw createError({
            statusCode: 405,
            message: 'Method not allowed',
        })
    }

    const currentUser = await requireAuth(event)
    const db = useDb()

    const body = await readBody(event)
    const validation = updateProfileSchema.safeParse(body)

    if (!validation.success) {
        throw createError({
            statusCode: 400,
            message: validation.error.errors[0].message,
        })
    }

    const { name, email, phone, currentPassword, newPassword } = validation.data

    // Check if email/phone is already used by another user
    if (email || phone) {
        const existingUser = await db.query.users.findFirst({
            where: (users, { or, eq, and, ne }) => {
                const conditions = []
                if (email) conditions.push(eq(users.email, email))
                if (phone) conditions.push(eq(users.phone, phone))
                return and(
                    or(...conditions),
                    ne(users.id, currentUser.id)
                )
            }
        })

        if (existingUser) {
            throw createError({
                statusCode: 400,
                message: 'Email atau nomor HP sudah digunakan',
            })
        }
    }

    // Prepare update data
    const updateData: any = {
        name,
        email: email || null,
        phone: phone || null,
        updatedAt: new Date(),
    }

    // Handle password change
    if (newPassword) {
        if (!currentPassword) {
            throw createError({
                statusCode: 400,
                message: 'Password lama harus diisi untuk ganti password',
            })
        }

        // Get user with password hash
        const userWithPassword = await db.query.users.findFirst({
            where: eq(users.id, currentUser.id),
        })

        if (!userWithPassword) {
            throw createError({
                statusCode: 404,
                message: 'User tidak ditemukan',
            })
        }

        // Verify current password
        const isValidPassword = await verifyPassword(currentPassword, userWithPassword.passwordHash)
        if (!isValidPassword) {
            throw createError({
                statusCode: 400,
                message: 'Password lama salah',
            })
        }

        // Hash new password
        updateData.passwordHash = await hashPassword(newPassword)
    }

    // Update user
    const [updatedUser] = await db.update(users)
        .set(updateData)
        .where(eq(users.id, currentUser.id))
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
        })

    return {
        success: true,
        message: 'Profile berhasil diperbarui',
        user: updatedUser,
    }
})
