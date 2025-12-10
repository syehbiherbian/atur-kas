import { z } from 'zod'
import { eq, desc, and } from 'drizzle-orm'
import { useDb, bills, billItems, kasMembers, transactions } from '../../../../db'
import { requireKasAccess } from '../index'

export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const kasId = getRouterParam(event, 'id')
    const db = useDb()

    if (method === 'GET') {
        await requireKasAccess(event)

        const billsList = await db.query.bills.findMany({
            where: eq(bills.kasId, kasId!),
            with: {
                items: {
                    with: {
                        member: {
                            with: {
                                user: {
                                    columns: {
                                        id: true,
                                        name: true,
                                        phone: true,
                                    }
                                }
                            }
                        }
                    }
                },
                createdByUser: {
                    columns: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: [desc(bills.dueDate)],
        })

        // Calculate statistics for each bill
        const billsWithStats = billsList.map(bill => {
            const totalMembers = bill.items.length
            const paidCount = bill.items.filter(i => i.status === 'PAID').length
            const partialCount = bill.items.filter(i => i.status === 'PARTIAL').length
            const unpaidCount = bill.items.filter(i => i.status === 'UNPAID').length
            const totalAmount = bill.items.reduce((sum, i) => sum + parseFloat(i.amount as string), 0)
            const paidAmount = bill.items.reduce((sum, i) => sum + parseFloat(i.paidAmount as string), 0)

            return {
                ...bill,
                stats: {
                    totalMembers,
                    paidCount,
                    partialCount,
                    unpaidCount,
                    totalAmount,
                    paidAmount,
                    percentage: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0,
                }
            }
        })

        return {
            success: true,
            data: billsWithStats,
        }
    }

    if (method === 'POST') {
        const { user } = await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const createSchema = z.object({
            name: z.string().min(1).max(255),
            description: z.string().optional().nullable(),
            amountDefault: z.number().positive(),
            dueDate: z.string().transform(s => new Date(s)),
            frequency: z.enum(['ONCE', 'MONTHLY', 'CUSTOM']).default('ONCE'),
            memberIds: z.array(z.string().uuid()).optional(), // If empty, apply to all active members
        })

        const body = await readBody(event)
        const validation = createSchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                message: validation.error.errors[0].message,
            })
        }

        const { memberIds, ...billData } = validation.data

        // Create bill
        const [newBill] = await db.insert(bills).values({
            kasId: kasId!,
            ...billData,
            amountDefault: billData.amountDefault.toString(),
            createdBy: user.id,
        }).returning()

        // Get members to assign bill items
        let targetMembers
        if (memberIds && memberIds.length > 0) {
            targetMembers = await db.query.kasMembers.findMany({
                where: and(
                    eq(kasMembers.kasId, kasId!),
                    eq(kasMembers.status, 'ACTIVE')
                ),
            })
            targetMembers = targetMembers.filter(m => memberIds.includes(m.id))
        } else {
            // All active members
            targetMembers = await db.query.kasMembers.findMany({
                where: and(
                    eq(kasMembers.kasId, kasId!),
                    eq(kasMembers.status, 'ACTIVE')
                ),
            })
        }

        // Create bill items for each member
        if (targetMembers.length > 0) {
            await db.insert(billItems).values(
                targetMembers.map(member => ({
                    billId: newBill.id,
                    memberId: member.id,
                    amount: billData.amountDefault.toString(),
                    status: 'UNPAID' as const,
                    paidAmount: '0',
                }))
            )
        }

        return {
            success: true,
            message: 'Tagihan berhasil dibuat',
            data: newBill,
        }
    }
})
