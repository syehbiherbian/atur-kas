import { d as defineEventHandler, g as getMethod, a as getRouterParam, b as getQuery, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import { z } from 'zod';
import { eq, desc, sql, and } from 'drizzle-orm';
import { u as useDb, t as transactions$1 } from '../../../../_/auth.mjs';
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

const transactions = defineEventHandler(async (event) => {
  var _a;
  const method = getMethod(event);
  const kasId = getRouterParam(event, "id");
  const db = useDb();
  if (method === "GET") {
    await requireKasAccess(event);
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const offset = (page - 1) * limit;
    const type = query.type;
    const categoryId = query.categoryId;
    const startDate = query.startDate;
    const endDate = query.endDate;
    eq(transactions$1.kasId, kasId);
    const txList = await db.query.transactions.findMany({
      where: (tx, { and: and2, eq: eq2, gte: gte2, lte: lte2 }) => {
        const conditions = [eq2(tx.kasId, kasId)];
        if (type) conditions.push(eq2(tx.type, type));
        if (categoryId) conditions.push(eq2(tx.categoryId, categoryId));
        if (startDate) conditions.push(gte2(tx.date, new Date(startDate)));
        if (endDate) conditions.push(lte2(tx.date, new Date(endDate)));
        return and2(...conditions);
      },
      with: {
        category: true,
        createdByUser: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: [desc(transactions$1.date), desc(transactions$1.createdAt)],
      limit,
      offset
    });
    const countResult = await db.select({ count: sql`count(*)` }).from(transactions$1).where(eq(transactions$1.kasId, kasId));
    const total = Number(((_a = countResult[0]) == null ? void 0 : _a.count) || 0);
    return {
      success: true,
      data: txList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  if (method === "POST") {
    const { user } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const createSchema = z.object({
      type: z.enum(["INCOME", "EXPENSE"]),
      categoryId: z.string().uuid().optional().nullable(),
      title: z.string().min(1).max(255),
      description: z.string().optional().nullable(),
      amount: z.number().positive("Nominal harus lebih dari 0"),
      date: z.string().transform((s) => new Date(s)),
      attachmentUrl: z.string().url().optional().nullable()
    });
    const body = await readBody(event);
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: validation.error.errors[0].message
      });
    }
    const [newTx] = await db.insert(transactions$1).values({
      kasId,
      ...validation.data,
      amount: validation.data.amount.toString(),
      createdBy: user.id
    }).returning();
    return {
      success: true,
      message: validation.data.type === "INCOME" ? "Pemasukan berhasil ditambahkan" : "Pengeluaran berhasil ditambahkan",
      data: newTx
    };
  }
  if (method === "PUT") {
    await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const updateSchema = z.object({
      id: z.string().uuid(),
      categoryId: z.string().uuid().optional().nullable(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional().nullable(),
      amount: z.number().positive().optional(),
      date: z.string().transform((s) => new Date(s)).optional(),
      attachmentUrl: z.string().url().optional().nullable()
    });
    const body = await readBody(event);
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: validation.error.errors[0].message
      });
    }
    const { id, ...updateData } = validation.data;
    const finalData = { ...updateData, updatedAt: /* @__PURE__ */ new Date() };
    if (finalData.amount) {
      finalData.amount = finalData.amount.toString();
    }
    const [updated] = await db.update(transactions$1).set(finalData).where(and(eq(transactions$1.id, id), eq(transactions$1.kasId, kasId))).returning();
    return {
      success: true,
      message: "Transaksi berhasil diperbarui",
      data: updated
    };
  }
  if (method === "DELETE") {
    await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const txId = getQuery(event).id;
    if (!txId) {
      throw createError({
        statusCode: 400,
        message: "Transaction ID is required"
      });
    }
    await db.delete(transactions$1).where(and(eq(transactions$1.id, txId), eq(transactions$1.kasId, kasId)));
    return {
      success: true,
      message: "Transaksi berhasil dihapus"
    };
  }
});

export { transactions as default };
//# sourceMappingURL=transactions.mjs.map
