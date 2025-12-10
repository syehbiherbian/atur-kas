import { d as defineEventHandler, g as getMethod, a as getRouterParam, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import { z } from 'zod';
import { desc, eq, and } from 'drizzle-orm';
import { u as useDb, e as bills, k as kasMembers, d as billItems } from '../../../../_/auth.mjs';
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

const index = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const kasId = getRouterParam(event, "id");
  const db = useDb();
  if (method === "GET") {
    await requireKasAccess(event);
    const billsList = await db.query.bills.findMany({
      where: eq(bills.kasId, kasId),
      with: {
        items: {
          with: {
            member: {
              with: {
                user: {
                  columns: {
                    id: true,
                    name: true,
                    phone: true
                  }
                }
              }
            }
          }
        },
        createdByUser: {
          columns: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [desc(bills.dueDate)]
    });
    const billsWithStats = billsList.map((bill) => {
      const totalMembers = bill.items.length;
      const paidCount = bill.items.filter((i) => i.status === "PAID").length;
      const partialCount = bill.items.filter((i) => i.status === "PARTIAL").length;
      const unpaidCount = bill.items.filter((i) => i.status === "UNPAID").length;
      const totalAmount = bill.items.reduce((sum, i) => sum + parseFloat(i.amount), 0);
      const paidAmount = bill.items.reduce((sum, i) => sum + parseFloat(i.paidAmount), 0);
      return {
        ...bill,
        stats: {
          totalMembers,
          paidCount,
          partialCount,
          unpaidCount,
          totalAmount,
          paidAmount,
          percentage: totalAmount > 0 ? Math.round(paidAmount / totalAmount * 100) : 0
        }
      };
    });
    return {
      success: true,
      data: billsWithStats
    };
  }
  if (method === "POST") {
    const { user } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const createSchema = z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional().nullable(),
      amountDefault: z.number().positive(),
      dueDate: z.string().transform((s) => new Date(s)),
      frequency: z.enum(["ONCE", "MONTHLY", "CUSTOM"]).default("ONCE"),
      memberIds: z.array(z.string().uuid()).optional()
      // If empty, apply to all active members
    });
    const body = await readBody(event);
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: validation.error.errors[0].message
      });
    }
    const { memberIds, ...billData } = validation.data;
    const [newBill] = await db.insert(bills).values({
      kasId,
      ...billData,
      amountDefault: billData.amountDefault.toString(),
      createdBy: user.id
    }).returning();
    let targetMembers;
    if (memberIds && memberIds.length > 0) {
      targetMembers = await db.query.kasMembers.findMany({
        where: and(
          eq(kasMembers.kasId, kasId),
          eq(kasMembers.status, "ACTIVE")
        )
      });
      targetMembers = targetMembers.filter((m) => memberIds.includes(m.id));
    } else {
      targetMembers = await db.query.kasMembers.findMany({
        where: and(
          eq(kasMembers.kasId, kasId),
          eq(kasMembers.status, "ACTIVE")
        )
      });
    }
    if (targetMembers.length > 0) {
      await db.insert(billItems).values(
        targetMembers.map((member) => ({
          billId: newBill.id,
          memberId: member.id,
          amount: billData.amountDefault.toString(),
          status: "UNPAID",
          paidAmount: "0"
        }))
      );
    }
    return {
      success: true,
      message: "Tagihan berhasil dibuat",
      data: newBill
    };
  }
});

export { index as default };
//# sourceMappingURL=index.mjs.map
