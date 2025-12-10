import { eq, and, sql, gte, lte } from 'drizzle-orm'
import { useDb, transactions } from '../../../db'
import { requireKasAccess } from './index'

export default defineEventHandler(async (event) => {
    const kasId = getRouterParam(event, 'id')
    await requireKasAccess(event)
    const db = useDb()

    const query = getQuery(event)
    const year = parseInt(query.year as string) || new Date().getFullYear()

    // Get monthly data for the year
    const monthlyData = await db.select({
        month: sql<number>`EXTRACT(MONTH FROM date)`,
        type: transactions.type,
        total: sql<string>`COALESCE(SUM(amount), 0)`
    })
        .from(transactions)
        .where(and(
            eq(transactions.kasId, kasId!),
            gte(transactions.date, new Date(year, 0, 1)),
            lte(transactions.date, new Date(year, 11, 31, 23, 59, 59))
        ))
        .groupBy(sql`EXTRACT(MONTH FROM date)`, transactions.type)

    // Format data for chart
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ]

    const chartData = {
        labels: months,
        income: new Array(12).fill(0),
        expense: new Array(12).fill(0),
    }

    monthlyData.forEach(item => {
        const monthIndex = Number(item.month) - 1
        const amount = parseFloat(item.total)
        if (item.type === 'INCOME') {
            chartData.income[monthIndex] = amount
        } else {
            chartData.expense[monthIndex] = amount
        }
    })

    // Calculate totals
    const totalIncome = chartData.income.reduce((a, b) => a + b, 0)
    const totalExpense = chartData.expense.reduce((a, b) => a + b, 0)

    return {
        success: true,
        data: {
            year,
            chartData,
            totals: {
                income: totalIncome,
                expense: totalExpense,
                net: totalIncome - totalExpense,
            }
        },
    }
})
