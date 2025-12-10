import { d as defineEventHandler, g as getMethod, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { z } from 'zod';
import { desc } from 'drizzle-orm';
import { r as requireAuth, u as useDb, j as kasGroups, k as kasMembers, f as transactionCategories } from '../../_/auth.mjs';
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

const index = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const user = await requireAuth(event);
  const db = useDb();
  if (method === "GET") {
    const memberships = await db.query.kasMembers.findMany({
      where: (members, { eq: eq2, and: and2 }) => and2(
        eq2(members.userId, user.id),
        eq2(members.status, "ACTIVE")
      ),
      with: {
        kas: {
          with: {
            owner: {
              columns: {
                id: true,
                name: true,
                avatarUrl: true
              }
            },
            members: {
              where: (m, { eq: eq2 }) => eq2(m.status, "ACTIVE")
            }
          }
        }
      },
      orderBy: (members) => desc(members.joinedAt)
    });
    const kasList = memberships.map((m) => {
      var _a;
      return {
        ...m.kas,
        role: m.role,
        joinedAt: m.joinedAt,
        memberCount: ((_a = m.kas.members) == null ? void 0 : _a.length) || 0,
        members: void 0
        // Remove members array from response
      };
    });
    return {
      success: true,
      data: kasList
    };
  }
  if (method === "POST") {
    const createSchema = z.object({
      name: z.string().min(2, "Nama kas minimal 2 karakter").max(255),
      description: z.string().optional(),
      kasType: z.string().optional(),
      currency: z.string().default("IDR"),
      timezone: z.string().default("Asia/Jakarta"),
      initialBalance: z.number().default(0)
    });
    const body = await readBody(event);
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation Error",
        message: validation.error.errors[0].message
      });
    }
    const { name, description, kasType, currency, timezone, initialBalance } = validation.data;
    const [newKas] = await db.insert(kasGroups).values({
      name,
      description,
      kasType,
      currency,
      timezone,
      initialBalance: initialBalance.toString(),
      ownerId: user.id
    }).returning();
    await db.insert(kasMembers).values({
      kasId: newKas.id,
      userId: user.id,
      role: "OWNER",
      status: "ACTIVE"
    });
    const defaultCategories = [
      // Income categories
      { name: "Iuran Bulanan", type: "INCOME", color: "#10b981" },
      { name: "Donasi", type: "INCOME", color: "#3b82f6" },
      { name: "Sponsor", type: "INCOME", color: "#8b5cf6" },
      { name: "Lainnya", type: "INCOME", color: "#6b7280" },
      // Expense categories
      { name: "Konsumsi", type: "EXPENSE", color: "#ef4444" },
      { name: "Operasional", type: "EXPENSE", color: "#f59e0b" },
      { name: "Transport", type: "EXPENSE", color: "#ec4899" },
      { name: "Lainnya", type: "EXPENSE", color: "#6b7280" }
    ];
    await db.insert(transactionCategories).values(
      defaultCategories.map((cat) => ({
        kasId: newKas.id,
        name: cat.name,
        type: cat.type,
        color: cat.color,
        createdBy: user.id
      }))
    );
    return {
      success: true,
      message: "Kas berhasil dibuat",
      data: newKas
    };
  }
});

export { index as default };
//# sourceMappingURL=index.mjs.map
