import { d as defineEventHandler, g as getMethod, a as getRouterParam, r as readBody, c as createError, b as getQuery } from '../../../../nitro/nitro.mjs';
import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { u as useDb, f as transactionCategories } from '../../../../_/auth.mjs';
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

const categories = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const kasId = getRouterParam(event, "id");
  const db = useDb();
  if (method === "GET") {
    await requireKasAccess(event);
    const categories = await db.query.transactionCategories.findMany({
      where: eq(transactionCategories.kasId, kasId),
      orderBy: [desc(transactionCategories.createdAt)]
    });
    return {
      success: true,
      data: categories
    };
  }
  if (method === "POST") {
    const { user } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const createSchema = z.object({
      name: z.string().min(1).max(100),
      type: z.enum(["INCOME", "EXPENSE"]),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#3b82f6"),
      icon: z.string().max(50).optional()
    });
    const body = await readBody(event);
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: validation.error.errors[0].message
      });
    }
    const [newCategory] = await db.insert(transactionCategories).values({
      kasId,
      ...validation.data,
      createdBy: user.id
    }).returning();
    return {
      success: true,
      message: "Kategori berhasil dibuat",
      data: newCategory
    };
  }
  if (method === "PUT") {
    await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const updateSchema = z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(100).optional(),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      icon: z.string().max(50).optional().nullable()
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
    const [updated] = await db.update(transactionCategories).set(updateData).where(eq(transactionCategories.id, id)).returning();
    return {
      success: true,
      message: "Kategori berhasil diperbarui",
      data: updated
    };
  }
  if (method === "DELETE") {
    await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const categoryId = getQuery(event).id;
    if (!categoryId) {
      throw createError({
        statusCode: 400,
        message: "Category ID is required"
      });
    }
    await db.delete(transactionCategories).where(eq(transactionCategories.id, categoryId));
    return {
      success: true,
      message: "Kategori berhasil dihapus"
    };
  }
});

export { categories as default };
//# sourceMappingURL=categories.mjs.map
