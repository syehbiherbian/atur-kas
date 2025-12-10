import { z } from 'zod'
import { useDb } from '../../db'
import { verifyPassword, generateToken, setAuthCookie } from '../../utils/auth'

// Validation schema
const loginSchema = z.object({
    identifier: z.string().min(1, 'Email atau nomor HP harus diisi'),
    password: z.string().min(1, 'Password harus diisi'),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: validation.error.errors[0].message,
        })
    }

    const { identifier, password } = validation.data
    const db = useDb()

    // Find user by email or phone
    const user = await db.query.users.findFirst({
        where: (users, { or, eq }) => or(
            eq(users.email, identifier),
            eq(users.phone, identifier)
        ),
    })

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Email/nomor HP atau password salah',
        })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Email/nomor HP atau password salah',
        })
    }

    // Generate token
    const token = generateToken({
        userId: user.id,
        email: user.email || undefined,
        phone: user.phone || undefined,
    })

    // Set cookie
    setAuthCookie(event, token)

    return {
        success: true,
        message: 'Login berhasil',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
        },
        token,
    }
})
