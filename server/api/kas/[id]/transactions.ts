import { z } from 'zod'
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm'
import { useDb, transactions, transactionCategories } from '../../../db'
import { requireKasAccess } from './index'

export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const kasId = getRouterParam(event, 'id')
    const db = useDb()

    if (method === 'GET') {
        await requireKasAccess(event)

        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 20
        const offset = (page - 1) * limit
        const type = query.type as 'INCOME' | 'EXPENSE' | undefined
        const categoryId = query.categoryId as string | undefined
        const startDate = query.startDate as string | undefined
        const endDate = query.endDate as string | undefined

        // Build where conditions
        let whereConditions = eq(transactions.kasId, kasId!)

        // Get transactions with filtering
        const txList = await db.query.transactions.findMany({
            where: (tx, { and, eq, gte, lte }) => {
                const conditions = [eq(tx.kasId, kasId!)]
                if (type) conditions.push(eq(tx.type, type))
                if (categoryId) conditions.push(eq(tx.categoryId, categoryId))
                if (startDate) conditions.push(gte(tx.date, new Date(startDate)))
                if (endDate) conditions.push(lte(tx.date, new Date(endDate)))
                return and(...conditions)
            },
            with: {
                category: true,
                createdByUser: {
                    columns: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: [desc(transactions.date), desc(transactions.createdAt)],
            limit,
            offset,
        })

        // Get total count
        const countResult = await db.select({ count: sql<number>`count(*)` })
            .from(transactions)
            .where(eq(transactions.kasId, kasId!))

        const total = Number(countResult[0]?.count || 0)

        return {
            success: true,
            data: txList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    }

    if (method === 'POST') {
        const { user } = await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const createSchema = z.object({
            type: z.enum(['INCOME', 'EXPENSE']),
            categoryId: z.string().uuid().optional().nullable(),
            title: z.string().min(1).max(255),
            description: z.string().optional().nullable(),
            amount: z.number().positive('Nominal harus lebih dari 0'),
            date: z.string().transform(s => new Date(s)),
            attachmentUrl: z.string().url().optional().nullable(),
        })

        const body = await readBody(event)
        const validation = createSchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                message: validation.error.errors[0].message,
            })
        }

        const [newTx] = await db.insert(transactions).values({
            kasId: kasId!,
            ...validation.data,
            amount: validation.data.amount.toString(),
            createdBy: user.id,
        }).returning()

        return {
            success: true,
            message: validation.data.type === 'INCOME' ? 'Pemasukan berhasil ditambahkan' : 'Pengeluaran berhasil ditambahkan',
            data: newTx,
        }
    }

    if (method === 'PUT') {
        await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const updateSchema = z.object({
            id: z.string().uuid(),
            categoryId: z.string().uuid().optional().nullable(),
            title: z.string().min(1).max(255).optional(),
            description: z.string().optional().nullable(),
            amount: z.number().positive().optional(),
            date: z.string().transform(s => new Date(s)).optional(),
            attachmentUrl: z.string().url().optional().nullable(),
        })

        const body = await readBody(event)
        const validation = updateSchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                message: validation.error.errors[0].message,
            })
        }

        const { id, ...updateData } = validation.data
        const finalData: any = { ...updateData, updatedAt: new Date() }
        if (finalData.amount) {
            finalData.amount = finalData.amount.toString()
        }

        const [updated] = await db.update(transactions)
            .set(finalData)
            .where(and(eq(transactions.id, id), eq(transactions.kasId, kasId!)))
            .returning()

        return {
            success: true,
            message: 'Transaksi berhasil diperbarui',
            data: updated,
        }
    }

    if (method === 'DELETE') {
        await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const txId = getQuery(event).id as string

        if (!txId) {
            throw createError({
                statusCode: 400,
                message: 'Transaction ID is required',
            })
        }

        await db.delete(transactions)
            .where(and(eq(transactions.id, txId), eq(transactions.kasId, kasId!)))

        return {
            success: true,
            message: 'Transaksi berhasil dihapus',
        }
    }
})
