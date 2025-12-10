import { eq, and, gt } from 'drizzle-orm'
import { useDb, invitations, kasGroups } from '../../../db'
import { requireKasAccess } from './index'
import { generateInviteToken } from '../../../utils/helpers'

export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const kasId = getRouterParam(event, 'id')
    const db = useDb()

    if (method === 'GET') {
        // Get active invitations
        const { kas } = await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const activeInvites = await db.query.invitations.findMany({
            where: and(
                eq(invitations.kasId, kasId!),
                gt(invitations.expiresAt, new Date())
            ),
        })

        return {
            success: true,
            data: activeInvites,
        }
    }

    if (method === 'POST') {
        // Create new invitation
        const { user, kas } = await requireKasAccess(event, ['OWNER', 'ADMIN'])
        const config = useRuntimeConfig()

        const body = await readBody(event) || {}
        const expiresInDays = body?.expiresInDays || 7
        const maxUses = body?.maxUses || null

        const token = generateInviteToken()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + expiresInDays)

        const [newInvite] = await db.insert(invitations).values({
            kasId: kasId!,
            inviteToken: token,
            expiresAt,
            maxUses,
            createdBy: user.id,
        }).returning()

        const inviteLink = `${config.public.appUrl}/join/${token}`

        // Generate WhatsApp share message
        const waMessage = `Halo! Yuk gabung ke Kas "${kas.name}". Klik link berikut untuk bergabung:\n${inviteLink}`
        const waShareLink = `https://wa.me/?text=${encodeURIComponent(waMessage)}`

        return {
            success: true,
            data: {
                ...newInvite,
                inviteLink,
                waShareLink,
                waMessage,
            },
        }
    }

    if (method === 'DELETE') {
        // Revoke invitation
        const { kas } = await requireKasAccess(event, ['OWNER', 'ADMIN'])
        const inviteId = getQuery(event).inviteId as string

        if (!inviteId) {
            throw createError({
                statusCode: 400,
                message: 'Invite ID is required',
            })
        }

        await db.delete(invitations)
            .where(and(
                eq(invitations.id, inviteId),
                eq(invitations.kasId, kasId!)
            ))

        return {
            success: true,
            message: 'Undangan berhasil dibatalkan',
        }
    }
})
