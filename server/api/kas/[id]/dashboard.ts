import { eq, and, sql, gte, lte, desc } from 'drizzle-orm'
import { useDb, kasGroups, transactions } from '../../../db'
import { requireKasAccess } from './index'

export default defineEventHandler(async (event) => {
    const kasId = getRouterParam(event, 'id')
    await requireKasAccess(event)
    const db = useDb()

    // Get kas details
    const kas = await db.query.kasGroups.findFirst({
        where: eq(kasGroups.id, kasId!),
    })

    if (!kas) {
        throw createError({
            statusCode: 404,
            message: 'Kas tidak ditemukan',
        })
    }

    // Calculate current month range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Get total income (all time)
    const totalIncomeResult = await db.select({
        total: sql<string>`COALESCE(SUM(amount), 0)`
    })
        .from(transactions)
        .where(and(
            eq(transactions.kasId, kasId!),
            eq(transactions.type, 'INCOME')
        ))

    // Get total expense (all time)  
    const totalExpenseResult = await db.select({
        total: sql<string>`COALESCE(SUM(amount), 0)`
    })
        .from(transactions)
        .where(and(
            eq(transactions.kasId, kasId!),
            eq(transactions.type, 'EXPENSE')
        ))

    // Get this month's income
    const monthIncomeResult = await db.select({
        total: sql<string>`COALESCE(SUM(amount), 0)`
    })
        .from(transactions)
        .where(and(
            eq(transactions.kasId, kasId!),
            eq(transactions.type, 'INCOME'),
            gte(transactions.date, startOfMonth),
            lte(transactions.date, endOfMonth)
        ))

    // Get this month's expense
    const monthExpenseResult = await db.select({
        total: sql<string>`COALESCE(SUM(amount), 0)`
    })
        .from(transactions)
        .where(and(
            eq(transactions.kasId, kasId!),
            eq(transactions.type, 'EXPENSE'),
            gte(transactions.date, startOfMonth),
            lte(transactions.date, endOfMonth)
        ))

    // Get recent transactions
    const recentTransactions = await db.query.transactions.findMany({
        where: eq(transactions.kasId, kasId!),
        with: {
            category: true,
        },
        orderBy: [desc(transactions.date), desc(transactions.createdAt)],
        limit: 10,
    })

    // Calculate balance
    const initialBalance = parseFloat(kas.initialBalance as string) || 0
    const totalIncome = parseFloat(totalIncomeResult[0]?.total || '0')
    const totalExpense = parseFloat(totalExpenseResult[0]?.total || '0')
    const currentBalance = initialBalance + totalIncome - totalExpense

    const monthIncome = parseFloat(monthIncomeResult[0]?.total || '0')
    const monthExpense = parseFloat(monthExpenseResult[0]?.total || '0')
    const monthCashflow = monthIncome - monthExpense

    return {
        success: true,
        data: {
            kas: {
                id: kas.id,
                name: kas.name,
                description: kas.description,
                currency: kas.currency,
            },
            summary: {
                currentBalance,
                initialBalance,
                totalIncome,
                totalExpense,
                monthIncome,
                monthExpense,
                monthCashflow,
                currentMonth: now.toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
            },
            recentTransactions,
        },
    }
})
