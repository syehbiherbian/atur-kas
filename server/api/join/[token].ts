import { eq, and, gt, sql } from 'drizzle-orm'
import { useDb, invitations, kasMembers, kasGroups } from '../../db'
import { requireAuth, getAuthUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const token = getRouterParam(event, 'token')
    const db = useDb()

    if (!token) {
        throw createError({
            statusCode: 400,
            message: 'Token undangan tidak valid',
        })
    }

    if (method === 'GET') {
        // Get invitation details (doesn't require auth)
        const invite = await db.query.invitations.findFirst({
            where: eq(invitations.inviteToken, token),
            with: {
                kas: {
                    columns: {
                        id: true,
                        name: true,
                        description: true,
                        kasType: true,
                    }
                }
            }
        })

        if (!invite) {
            throw createError({
                statusCode: 404,
                message: 'Undangan tidak ditemukan',
            })
        }

        // Check if expired
        if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
            throw createError({
                statusCode: 410,
                message: 'Undangan sudah kedaluwarsa',
            })
        }

        // Check max uses
        if (invite.maxUses && invite.usedCount >= invite.maxUses) {
            throw createError({
                statusCode: 410,
                message: 'Undangan sudah mencapai batas penggunaan',
            })
        }

        // Check if user is logged in and already a member
        const user = await getAuthUser(event)
        let isMember = false

        if (user) {
            const existingMember = await db.query.kasMembers.findFirst({
                where: and(
                    eq(kasMembers.kasId, invite.kasId),
                    eq(kasMembers.userId, user.id)
                )
            })
            isMember = !!existingMember
        }

        return {
            success: true,
            data: {
                kasId: invite.kas.id,
                kasName: invite.kas.name,
                kasDescription: invite.kas.description,
                kasType: invite.kas.kasType,
                isLoggedIn: !!user,
                isMember,
            },
        }
    }

    if (method === 'POST') {
        // Join kas via invitation
        const user = await requireAuth(event)

        const invite = await db.query.invitations.findFirst({
            where: eq(invitations.inviteToken, token),
        })

        if (!invite) {
            throw createError({
                statusCode: 404,
                message: 'Undangan tidak ditemukan',
            })
        }

        // Validate invitation
        if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
            throw createError({
                statusCode: 410,
                message: 'Undangan sudah kedaluwarsa',
            })
        }

        if (invite.maxUses && invite.usedCount >= invite.maxUses) {
            throw createError({
                statusCode: 410,
                message: 'Undangan sudah mencapai batas penggunaan',
            })
        }

        // Check if already a member
        const existingMember = await db.query.kasMembers.findFirst({
            where: and(
                eq(kasMembers.kasId, invite.kasId),
                eq(kasMembers.userId, user.id)
            )
        })

        if (existingMember) {
            if (existingMember.status === 'ACTIVE') {
                throw createError({
                    statusCode: 409,
                    message: 'Anda sudah menjadi anggota kas ini',
                })
            }

            // Reactivate if was LEFT or SUSPENDED
            await db.update(kasMembers)
                .set({ status: 'ACTIVE', leftAt: null })
                .where(eq(kasMembers.id, existingMember.id))
        } else {
            // Create new membership
            await db.insert(kasMembers).values({
                kasId: invite.kasId,
                userId: user.id,
                role: 'MEMBER',
                status: 'ACTIVE',
            })
        }

        // Increment used count
        await db.update(invitations)
            .set({ usedCount: sql`${invitations.usedCount} + 1` })
            .where(eq(invitations.id, invite.id))

        return {
            success: true,
            message: 'Berhasil bergabung ke kas',
            kasId: invite.kasId,
        }
    }
})
