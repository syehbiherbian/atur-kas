import { d as defineEventHandler, a as getRouterParam, b as getQuery } from '../../../../nitro/nitro.mjs';
import { sql, and, eq, gte, lte } from 'drizzle-orm';
import { u as useDb, t as transactions } from '../../../../_/auth.mjs';
import { requireKasAccess } from '../index.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'bcryptjs';
import '@neondatabase/serverless';
import 'drizzle-orm/neon-http';
import 'drizzle-orm/pg-core';
import 'zod';

const chartData = defineEventHandler(async (event) => {
  const kasId = getRouterParam(event, "id");
  await requireKasAccess(event);
  const db = useDb();
  const query = getQuery(event);
  const year = parseInt(query.year) || (/* @__PURE__ */ new Date()).getFullYear();
  const monthlyData = await db.select({
    month: sql`EXTRACT(MONTH FROM date)`,
    type: transactions.type,
    total: sql`COALESCE(SUM(amount), 0)`
  }).from(transactions).where(and(
    eq(transactions.kasId, kasId),
    gte(transactions.date, new Date(year, 0, 1)),
    lte(transactions.date, new Date(year, 11, 31, 23, 59, 59))
  )).groupBy(sql`EXTRACT(MONTH FROM date)`, transactions.type);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des"
  ];
  const chartData = {
    labels: months,
    income: new Array(12).fill(0),
    expense: new Array(12).fill(0)
  };
  monthlyData.forEach((item) => {
    const monthIndex = Number(item.month) - 1;
    const amount = parseFloat(item.total);
    if (item.type === "INCOME") {
      chartData.income[monthIndex] = amount;
    } else {
      chartData.expense[monthIndex] = amount;
    }
  });
  const totalIncome = chartData.income.reduce((a, b) => a + b, 0);
  const totalExpense = chartData.expense.reduce((a, b) => a + b, 0);
  return {
    success: true,
    data: {
      year,
      chartData,
      totals: {
        income: totalIncome,
        expense: totalExpense,
        net: totalIncome - totalExpense
      }
    }
  };
});

export { chartData as default };
//# sourceMappingURL=chart-data.mjs.map
