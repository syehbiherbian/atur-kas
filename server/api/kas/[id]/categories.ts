import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { useDb, transactionCategories } from '../../../db'
import { requireKasAccess } from './index'

export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    const kasId = getRouterParam(event, 'id')
    const db = useDb()

    if (method === 'GET') {
        await requireKasAccess(event)

        const categories = await db.query.transactionCategories.findMany({
            where: eq(transactionCategories.kasId, kasId!),
            orderBy: [desc(transactionCategories.createdAt)],
        })

        return {
            success: true,
            data: categories,
        }
    }

    if (method === 'POST') {
        const { user } = await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const createSchema = z.object({
            name: z.string().min(1).max(100),
            type: z.enum(['INCOME', 'EXPENSE']),
            color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#3b82f6'),
            icon: z.string().max(50).optional(),
        })

        const body = await readBody(event)
        const validation = createSchema.safeParse(body)

        if (!validation.success) {
            throw createError({
                statusCode: 400,
                message: validation.error.errors[0].message,
            })
        }

        const [newCategory] = await db.insert(transactionCategories).values({
            kasId: kasId!,
            ...validation.data,
            createdBy: user.id,
        }).returning()

        return {
            success: true,
            message: 'Kategori berhasil dibuat',
            data: newCategory,
        }
    }

    if (method === 'PUT') {
        await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const updateSchema = z.object({
            id: z.string().uuid(),
            name: z.string().min(1).max(100).optional(),
            color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
            icon: z.string().max(50).optional().nullable(),
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

        const [updated] = await db.update(transactionCategories)
            .set(updateData)
            .where(eq(transactionCategories.id, id))
            .returning()

        return {
            success: true,
            message: 'Kategori berhasil diperbarui',
            data: updated,
        }
    }

    if (method === 'DELETE') {
        await requireKasAccess(event, ['OWNER', 'ADMIN'])

        const categoryId = getQuery(event).id as string

        if (!categoryId) {
            throw createError({
                statusCode: 400,
                message: 'Category ID is required',
            })
        }

        await db.delete(transactionCategories)
            .where(eq(transactionCategories.id, categoryId))

        return {
            success: true,
            message: 'Kategori berhasil dihapus',
        }
    }
})
