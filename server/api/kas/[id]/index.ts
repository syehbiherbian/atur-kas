import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { useDb, kasGroups, kasMembers } from '../../../db'
import { requireAuth } from '../../../utils/auth'

// Middleware to check Kas access
export const requireKasAccess = async (event: any, roles?: ('OWNER' | 'ADMIN' | 'MEMBER')[]) => {
    const user = await requireAuth(event)
    const kasId = getRouterParam(event, 'id')

    if (!kasId) {
        throw createError({
            statusCode: 400,
            message: 'Kas ID is required',
        })
    }

    const db = useDb()

    // Find membership
    const membership = await db.query.kasMembers.findFirst({
        where: (members, { eq, and }) => and(
            eq(members.kasId, kasId),
            eq(members.userId, user.id),
            eq(members.status, 'ACTIVE')
        ),
        with: {
            kas: true,
        }
    })

    if (!membership) {
        throw createError({
            statusCode: 403,
            message: 'Anda tidak memiliki akses ke kas ini',
        })
    }

    // Check role if specified
    if (roles && roles.length > 0 && !roles.includes(membership.role)) {
        throw createError({
            statusCode: 403,
            message: 'Anda tidak memiliki izin untuk melakukan aksi ini',
        })
    }

    return {
        user,
        kas: membership.kas,
        membership,
        role: membership.role,
    }
}

export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const kasId = getRouterParam(event, 'id')
    const db = useDb()

    if (method === 'GET') {
        const { user, kas, role } = await requireKasAccess(event)

        // Get kas with additional info
        const kasWithDetails = await db.query.kasGroups.findFirst({
            where: eq(kasGroups.id, kasId!),
            with: {
                owner: {
                    columns: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                },
                members: {
                    where: eq(kasMembers.status, 'ACTIVE'),
                }
            }
        })

        return {
            success: true,
            data: {
                ...kasWithDetails,
                currentUserRole: role,
                memberCount: kasWithDetails?.members?.length || 0,
            },
        }
    }

    if (method === 'PUT') {
        const { kas } = await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const updateSchema = z.object({
            name: z.string().min(2).max(255).optional(),
            description: z.string().optional().nullable(),
            kasType: z.string().optional().nullable(),
            currency: z.string().optional(),
            timezone: z.string().optional(),
            initialBalance: z.number().optional(),
        })

        const body = await readBody(event)
        const validation = updateSchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                message: validation.error.errors[0].message,
            })
        }

        const updateData: any = { ...validation.data, updatedAt: new Date() }
        if (updateData.initialBalance !== undefined) {
            updateData.initialBalance = updateData.initialBalance.toString()
        }

        const [updated] = await db.update(kasGroups)
            .set(updateData)
            .where(eq(kasGroups.id, kasId!))
            .returning()

        return {
            success: true,
            message: 'Kas berhasil diperbarui',
            data: updated,
        }
    }

    if (method === 'DELETE') {
        const { kas } = await requireKasAccess(event, ['OWNER'])

        // Soft delete by archiving
        await db.update(kasGroups)
            .set({ isArchived: true, updatedAt: new Date() })
            .where(eq(kasGroups.id, kasId!))

        return {
            success: true,
            message: 'Kas berhasil diarsipkan',
        }
    }
})
