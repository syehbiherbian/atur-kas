import { d as defineEventHandler, a as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import { eq, sql, and, gte, lte, desc } from 'drizzle-orm';
import { u as useDb, j as kasGroups, t as transactions } from '../../../../_/auth.mjs';
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

const dashboard = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const kasId = getRouterParam(event, "id");
  await requireKasAccess(event);
  const db = useDb();
  const kas = await db.query.kasGroups.findFirst({
    where: eq(kasGroups.id, kasId)
  });
  if (!kas) {
    throw createError({
      statusCode: 404,
      message: "Kas tidak ditemukan"
    });
  }
  const now = /* @__PURE__ */ new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const totalIncomeResult = await db.select({
    total: sql`COALESCE(SUM(amount), 0)`
  }).from(transactions).where(and(
    eq(transactions.kasId, kasId),
    eq(transactions.type, "INCOME")
  ));
  const totalExpenseResult = await db.select({
    total: sql`COALESCE(SUM(amount), 0)`
  }).from(transactions).where(and(
    eq(transactions.kasId, kasId),
    eq(transactions.type, "EXPENSE")
  ));
  const monthIncomeResult = await db.select({
    total: sql`COALESCE(SUM(amount), 0)`
  }).from(transactions).where(and(
    eq(transactions.kasId, kasId),
    eq(transactions.type, "INCOME"),
    gte(transactions.date, startOfMonth),
    lte(transactions.date, endOfMonth)
  ));
  const monthExpenseResult = await db.select({
    total: sql`COALESCE(SUM(amount), 0)`
  }).from(transactions).where(and(
    eq(transactions.kasId, kasId),
    eq(transactions.type, "EXPENSE"),
    gte(transactions.date, startOfMonth),
    lte(transactions.date, endOfMonth)
  ));
  const recentTransactions = await db.query.transactions.findMany({
    where: eq(transactions.kasId, kasId),
    with: {
      category: true
    },
    orderBy: [desc(transactions.date), desc(transactions.createdAt)],
    limit: 10
  });
  const initialBalance = parseFloat(kas.initialBalance) || 0;
  const totalIncome = parseFloat(((_a = totalIncomeResult[0]) == null ? void 0 : _a.total) || "0");
  const totalExpense = parseFloat(((_b = totalExpenseResult[0]) == null ? void 0 : _b.total) || "0");
  const currentBalance = initialBalance + totalIncome - totalExpense;
  const monthIncome = parseFloat(((_c = monthIncomeResult[0]) == null ? void 0 : _c.total) || "0");
  const monthExpense = parseFloat(((_d = monthExpenseResult[0]) == null ? void 0 : _d.total) || "0");
  const monthCashflow = monthIncome - monthExpense;
  return {
    success: true,
    data: {
      kas: {
        id: kas.id,
        name: kas.name,
        description: kas.description,
        currency: kas.currency
      },
      summary: {
        currentBalance,
        initialBalance,
        totalIncome,
        totalExpense,
        monthIncome,
        monthExpense,
        monthCashflow,
        currentMonth: now.toLocaleString("id-ID", { month: "long", year: "numeric" })
      },
      recentTransactions
    }
  };
});

export { dashboard as default };
//# sourceMappingURL=dashboard.mjs.map
