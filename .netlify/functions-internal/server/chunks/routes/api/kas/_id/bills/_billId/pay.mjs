import { d as defineEventHandler, g as getMethod, a as getRouterParam, r as readBody, c as createError } from '../../../../../../nitro/nitro.mjs';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { u as useDb, d as billItems, t as transactions } from '../../../../../../_/auth.mjs';
import { requireKasAccess } from '../../../index.mjs';
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

const pay = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const kasId = getRouterParam(event, "id");
  getRouterParam(event, "billId");
  const db = useDb();
  if (method === "POST") {
    const { user } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const paySchema = z.object({
      billItemId: z.string().uuid(),
      amount: z.number().positive(),
      note: z.string().optional()
    });
    const body = await readBody(event);
    const validation = paySchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: validation.error.errors[0].message
      });
    }
    const { billItemId, amount, note } = validation.data;
    const billItem = await db.query.billItems.findFirst({
      where: eq(billItems.id, billItemId),
      with: {
        bill: true,
        member: {
          with: {
            user: {
              columns: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    if (!billItem) {
      throw createError({
        statusCode: 404,
        message: "Item tagihan tidak ditemukan"
      });
    }
    const currentPaid = parseFloat(billItem.paidAmount) || 0;
    const totalDue = parseFloat(billItem.amount);
    const newPaidAmount = currentPaid + amount;
    let newStatus = "PARTIAL";
    if (newPaidAmount >= totalDue) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL";
    }
    const [updatedItem] = await db.update(billItems).set({
      paidAmount: Math.min(newPaidAmount, totalDue).toString(),
      status: newStatus,
      paidAt: newStatus === "PAID" ? /* @__PURE__ */ new Date() : null,
      note: note || billItem.note,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(billItems.id, billItemId)).returning();
    const [newTx] = await db.insert(transactions).values({
      kasId,
      type: "INCOME",
      title: `Pembayaran ${billItem.bill.name} - ${billItem.member.user.name}`,
      description: note || `Pembayaran tagihan ${billItem.bill.name}`,
      amount: amount.toString(),
      date: /* @__PURE__ */ new Date(),
      createdBy: user.id,
      billItemId
    }).returning();
    return {
      success: true,
      message: "Pembayaran berhasil dicatat",
      data: {
        billItem: updatedItem,
        transaction: newTx
      }
    };
  }
});

export { pay as default };
//# sourceMappingURL=pay.mjs.map
