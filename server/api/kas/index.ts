import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { useDb, kasGroups, kasMembers, transactionCategories } from '../../db'
import { requireAuth } from '../../utils/auth'
import { nanoid } from '../../utils/helpers'

// Get all Kas groups for current user
export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const user = await requireAuth(event)
    const db = useDb()

    if (method === 'GET') {
        // Get all kas where user is a member
        const memberships = await db.query.kasMembers.findMany({
            where: (members, { eq, and }) => and(
                eq(members.userId, user.id),
                eq(members.status, 'ACTIVE')
            ),
            with: {
                kas: {
                    with: {
                        owner: {
                            columns: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            }
                        },
                        members: {
                            where: (m, { eq }) => eq(m.status, 'ACTIVE'),
                        }
                    }
                }
            },
            orderBy: (members) => desc(members.joinedAt),
        })

        const kasList = memberships.map(m => ({
            ...m.kas,
            role: m.role,
            joinedAt: m.joinedAt,
            memberCount: m.kas.members?.length || 0,
            members: undefined, // Remove members array from response
        }))

        return {
            success: true,
            data: kasList,
        }
    }

    if (method === 'POST') {
        // Create new Kas
        const createSchema = z.object({
            name: z.string().min(2, 'Nama kas minimal 2 karakter').max(255),
            description: z.string().optional(),
            kasType: z.string().optional(),
            currency: z.string().default('IDR'),
            timezone: z.string().default('Asia/Jakarta'),
            initialBalance: z.number().default(0),
        })

        const body = await readBody(event)
        const validation = createSchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Validation Error',
                message: validation.error.errors[0].message,
            })
        }

        const { name, description, kasType, currency, timezone, initialBalance } = validation.data

        // Create kas
        const [newKas] = await db.insert(kasGroups).values({
            name,
            description,
            kasType,
            currency,
            timezone,
            initialBalance: initialBalance.toString(),
            ownerId: user.id,
        }).returning()

        // Add owner as member with OWNER role
        await db.insert(kasMembers).values({
            kasId: newKas.id,
            userId: user.id,
            role: 'OWNER',
            status: 'ACTIVE',
        })

        // Create default categories
        const defaultCategories = [
            // Income categories
            { name: 'Iuran Bulanan', type: 'INCOME' as const, color: '#10b981' },
            { name: 'Donasi', type: 'INCOME' as const, color: '#3b82f6' },
            { name: 'Sponsor', type: 'INCOME' as const, color: '#8b5cf6' },
            { name: 'Lainnya', type: 'INCOME' as const, color: '#6b7280' },
            // Expense categories
            { name: 'Konsumsi', type: 'EXPENSE' as const, color: '#ef4444' },
            { name: 'Operasional', type: 'EXPENSE' as const, color: '#f59e0b' },
            { name: 'Transport', type: 'EXPENSE' as const, color: '#ec4899' },
            { name: 'Lainnya', type: 'EXPENSE' as const, color: '#6b7280' },
        ]

        await db.insert(transactionCategories).values(
            defaultCategories.map(cat => ({
                kasId: newKas.id,
                name: cat.name,
                type: cat.type,
                color: cat.color,
                createdBy: user.id,
            }))
        )

        return {
            success: true,
            message: 'Kas berhasil dibuat',
            data: newKas,
        }
    }
})
