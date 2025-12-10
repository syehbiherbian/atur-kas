import { z } from 'zod'
import { eq, or } from 'drizzle-orm'
import { useDb, users } from '../../db'
import { hashPassword, generateToken, setAuthCookie } from '../../utils/auth'

// Validation schema
const registerSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(255),
    email: z.string().email('Email tidak valid').optional().nullable(),
    phone: z.string().min(10, 'Nomor HP minimal 10 digit').max(20).optional().nullable(),
    password: z.string().min(6, 'Password minimal 6 karakter'),
}).refine(data => data.email || data.phone, {
    message: 'Email atau nomor HP harus diisi',
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: validation.error.errors[0].message,
        })
    }

    const { name, email, phone, password } = validation.data
    const db = useDb()

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
        where: (users, { or, eq }) => {
            const conditions = []
            if (email) conditions.push(eq(users.email, email))
            if (phone) conditions.push(eq(users.phone, phone))
            return conditions.length > 0 ? or(...conditions) : undefined
        }
    })

    if (existingUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'Email atau nomor HP sudah terdaftar',
        })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const [newUser] = await db.insert(users).values({
        name,
        email: email || null,
        phone: phone || null,
        passwordHash,
    }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        avatarUrl: users.avatarUrl,
    })

    // Generate token
    const token = generateToken({
        userId: newUser.id,
        email: newUser.email || undefined,
        phone: newUser.phone || undefined,
    })

    // Set cookie
    setAuthCookie(event, token)

    return {
        success: true,
        message: 'Registrasi berhasil',
        user: newUser,
        token,
    }
})
