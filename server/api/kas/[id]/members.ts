import { z } from 'zod'
import { eq, and, desc, or } from 'drizzle-orm'
import { useDb, kasMembers, users } from '../../../db'
import { requireKasAccess } from './index'
import { hashPassword } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const kasId = getRouterParam(event, 'id')
    const db = useDb()

    // POST - Add new member directly
    if (method === 'POST') {
        const { kas, role: currentUserRole } = await requireKasAccess(event, ['OWNER'])

        const addMemberSchema = z.object({
            name: z.string().min(2, 'Nama minimal 2 karakter').max(255),
            phone: z.string().min(10, 'Nomor HP minimal 10 digit').max(20).optional().nullable(),
            email: z.string().email('Email tidak valid').optional().nullable(),
            password: z.string().min(6, 'Password minimal 6 karakter'),
            role: z.enum(['ADMIN', 'MEMBER']),
        }).refine(data => data.email || data.phone, {
            message: 'Email atau nomor HP harus diisi',
        })

        const body = await readBody(event)
        const validation = addMemberSchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                message: validation.error.errors[0].message,
            })
        }

        const { name, phone, email, password, role } = validation.data

        // Check if user already exists with this phone/email
        let existingUser = await db.query.users.findFirst({
            where: (users, { or, eq }) => {
                const conditions = []
                if (email) conditions.push(eq(users.email, email))
                if (phone) conditions.push(eq(users.phone, phone))
                return conditions.length > 0 ? or(...conditions) : undefined
            }
        })

        let userId: string

        if (existingUser) {
            // User exists, check if already a member
            const existingMember = await db.query.kasMembers.findFirst({
                where: and(
                    eq(kasMembers.kasId, kasId!),
                    eq(kasMembers.userId, existingUser.id)
                )
            })

            if (existingMember && existingMember.status === 'ACTIVE') {
                throw createError({
                    statusCode: 400,
                    message: 'Pengguna sudah menjadi anggota kas ini',
                })
            }

            userId = existingUser.id
        } else {
            // Create new user
            const hashedPassword = await hashPassword(password)
            const [newUser] = await db.insert(users).values({
                name,
                phone: phone || null,
                email: email || null,
                passwordHash: hashedPassword,
            }).returning()
            userId = newUser.id
        }

        // Add user as member
        const [newMember] = await db.insert(kasMembers).values({
            kasId: kasId!,
            userId,
            role,
            status: 'ACTIVE',
            joinedAt: new Date(),
        }).returning()

        // Get member with user data
        const memberWithUser = await db.query.kasMembers.findFirst({
            where: eq(kasMembers.id, newMember.id),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        })

        return {
            success: true,
            message: 'Anggota berhasil ditambahkan',
            data: memberWithUser,
        }
    }

    if (method === 'GET') {
        const { kas } = await requireKasAccess(event)

        // Get all members
        const members = await db.query.kasMembers.findMany({
            where: eq(kasMembers.kasId, kasId!),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: [desc(kasMembers.joinedAt)],
        })

        return {
            success: true,
            data: members.map(m => ({
                id: m.id,
                userId: m.userId,
                role: m.role,
                status: m.status,
                joinedAt: m.joinedAt,
                leftAt: m.leftAt,
                user: m.user,
            })),
        }
    }

    if (method === 'PUT') {
        // Update member role or status
        const { kas, role: currentUserRole } = await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const updateSchema = z.object({
            memberId: z.string().uuid(),
            role: z.enum(['ADMIN', 'MEMBER']).optional(),
            status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
        })

        const body = await readBody(event)
        const validation = updateSchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                message: validation.error.errors[0].message,
            })
        }

        const { memberId, role, status } = validation.data

        // Get target member
        const targetMember = await db.query.kasMembers.findFirst({
            where: and(
                eq(kasMembers.id, memberId),
                eq(kasMembers.kasId, kasId!)
            )
        })

        if (!targetMember) {
            throw createError({
                statusCode: 404,
                message: 'Member tidak ditemukan',
            })
        }

        // Prevent modifying owner
        if (targetMember.role === 'OWNER') {
            throw createError({
                statusCode: 403,
                message: 'Tidak dapat mengubah owner kas',
            })
        }

        // Only owner can change roles
        if (role && currentUserRole !== 'OWNER') {
            throw createError({
                statusCode: 403,
                message: 'Hanya owner yang dapat mengubah role',
            })
        }

        const updateData: any = {}
        if (role) updateData.role = role
        if (status) {
            updateData.status = status
            if (status === 'SUSPENDED') {
                updateData.leftAt = new Date()
            }
        }

        const [updated] = await db.update(kasMembers)
            .set(updateData)
            .where(eq(kasMembers.id, memberId))
            .returning()

        return {
            success: true,
            message: 'Member berhasil diperbarui',
            data: updated,
        }
    }

    if (method === 'DELETE') {
        // Remove member
        const { kas } = await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const memberId = getQuery(event).memberId as string

        if (!memberId) {
            throw createError({
                statusCode: 400,
                message: 'Member ID is required',
            })
        }

        // Get target member
        const targetMember = await db.query.kasMembers.findFirst({
            where: and(
                eq(kasMembers.id, memberId),
                eq(kasMembers.kasId, kasId!)
            )
        })

        if (!targetMember) {
            throw createError({
                statusCode: 404,
                message: 'Member tidak ditemukan',
            })
        }

        if (targetMember.role === 'OWNER') {
            throw createError({
                statusCode: 403,
                message: 'Tidak dapat menghapus owner kas',
            })
        }

        // Soft delete - set status to LEFT
        await db.update(kasMembers)
            .set({ status: 'LEFT', leftAt: new Date() })
            .where(eq(kasMembers.id, memberId))

        return {
            success: true,
            message: 'Member berhasil dihapus',
        }
    }
})
