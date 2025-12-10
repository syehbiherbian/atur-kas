import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { useDb, billItems, transactions, kasMembers } from '../../../../../db'
import { requireKasAccess } from '../../index'

export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const kasId = getRouterParam(event, 'id')
    const billId = getRouterParam(event, 'billId')
    const db = useDb()

    if (method === 'POST') {
        // Mark bill item as paid
        const { user } = await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const paySchema = z.object({
            billItemId: z.string().uuid(),
            amount: z.number().positive(),
            note: z.string().optional(),
        })

        const body = await readBody(event)
        const validation = paySchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                message: validation.error.errors[0].message,
            })
        }

        const { billItemId, amount, note } = validation.data

        // Get bill item with member and bill info
        const billItem = await db.query.billItems.findFirst({
            where: eq(billItems.id, billItemId),
            with: {
                bill: true,
                member: {
                    with: {
                        user: {
                            columns: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        })

        if (!billItem) {
            throw createError({
                statusCode: 404,
                message: 'Item tagihan tidak ditemukan',
            })
        }

        // Calculate new paid amount
        const currentPaid = parseFloat(billItem.paidAmount as string) || 0
        const totalDue = parseFloat(billItem.amount as string)
        const newPaidAmount = currentPaid + amount

        // Determine new status
        let newStatus: 'UNPAID' | 'PARTIAL' | 'PAID' = 'PARTIAL'
        if (newPaidAmount >= totalDue) {
            newStatus = 'PAID'
        } else if (newPaidAmount > 0) {
            newStatus = 'PARTIAL'
        }

        // Update bill item
        const [updatedItem] = await db.update(billItems)
            .set({
                paidAmount: Math.min(newPaidAmount, totalDue).toString(),
                status: newStatus,
                paidAt: newStatus === 'PAID' ? new Date() : null,
                note: note || billItem.note,
                updatedAt: new Date(),
            })
            .where(eq(billItems.id, billItemId))
            .returning()

        // Auto-create income transaction
        const [newTx] = await db.insert(transactions).values({
            kasId: kasId!,
            type: 'INCOME',
            title: `Pembayaran ${billItem.bill.name} - ${billItem.member.user.name}`,
            description: note || `Pembayaran tagihan ${billItem.bill.name}`,
            amount: amount.toString(),
            date: new Date(),
            createdBy: user.id,
            billItemId: billItemId,
        }).returning()

        return {
            success: true,
            message: 'Pembayaran berhasil dicatat',
            data: {
                billItem: updatedItem,
                transaction: newTx,
            },
        }
    }
})
