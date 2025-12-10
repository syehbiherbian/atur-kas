import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'

const SALT_ROUNDS = 10
const TOKEN_EXPIRY = '7d'

export interface JwtPayload {
    userId: string
    email?: string
    phone?: string
}

export interface AuthUser {
    id: string
    name: string
    email: string | null
    phone: string | null
    avatarUrl: string | null
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}

// Generate JWT token
export const generateToken = (payload: JwtPayload): string => {
    const config = useRuntimeConfig()
    return jwt.sign(payload, config.authSecret, { expiresIn: TOKEN_EXPIRY })
}

// Verify JWT token
export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const config = useRuntimeConfig()
        return jwt.verify(token, config.authSecret) as JwtPayload
    } catch {
        return null
    }
}

// Get token from request headers or cookies
export const getTokenFromRequest = (event: H3Event): string | null => {
    // Check Authorization header first
    const authHeader = getHeader(event, 'authorization')
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }

    // Check cookies
    const token = getCookie(event, 'auth_token')
    return token || null
}

// Get authenticated user from request
export const getAuthUser = async (event: H3Event): Promise<AuthUser | null> => {
    const token = getTokenFromRequest(event)
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    // Get user from database
    const db = useDb()
    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, payload.userId),
        columns: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
        }
    })

    return user || null
}

// Require authentication middleware helper
export const requireAuth = async (event: H3Event): Promise<AuthUser> => {
    const user = await getAuthUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Authentication required'
        })
    }
    return user
}

// Set auth cookie
export const setAuthCookie = (event: H3Event, token: string) => {
    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
    })
}

// Clear auth cookie
export const clearAuthCookie = (event: H3Event) => {
    deleteCookie(event, 'auth_token', {
        path: '/'
    })
}

// Import db
import { useDb } from '../db'
