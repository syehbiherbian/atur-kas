import { d as defineEventHandler, g as getMethod, a as getRouterParam, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { u as useDb, k as kasMembers, j as kasGroups, r as requireAuth } from '../../../_/auth.mjs';
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

const requireKasAccess = async (event, roles) => {
  const user = await requireAuth(event);
  const kasId = getRouterParam(event, "id");
  if (!kasId) {
    throw createError({
      statusCode: 400,
      message: "Kas ID is required"
    });
  }
  const db = useDb();
  const membership = await db.query.kasMembers.findFirst({
    where: (members, { eq: eq2, and: and2 }) => and2(
      eq2(members.kasId, kasId),
      eq2(members.userId, user.id),
      eq2(members.status, "ACTIVE")
    ),
    with: {
      kas: true
    }
  });
  if (!membership) {
    throw createError({
      statusCode: 403,
      message: "Anda tidak memiliki akses ke kas ini"
    });
  }
  if (roles && roles.length > 0 && !roles.includes(membership.role)) {
    throw createError({
      statusCode: 403,
      message: "Anda tidak memiliki izin untuk melakukan aksi ini"
    });
  }
  return {
    user,
    kas: membership.kas,
    membership,
    role: membership.role
  };
};
const index = defineEventHandler(async (event) => {
  var _a;
  const method = getMethod(event);
  const kasId = getRouterParam(event, "id");
  const db = useDb();
  if (method === "GET") {
    const { user, kas, role } = await requireKasAccess(event);
    const kasWithDetails = await db.query.kasGroups.findFirst({
      where: eq(kasGroups.id, kasId),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        members: {
          where: eq(kasMembers.status, "ACTIVE")
        }
      }
    });
    return {
      success: true,
      data: {
        ...kasWithDetails,
        currentUserRole: role,
        memberCount: ((_a = kasWithDetails == null ? void 0 : kasWithDetails.members) == null ? void 0 : _a.length) || 0
      }
    };
  }
  if (method === "PUT") {
    const { kas } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const updateSchema = z.object({
      name: z.string().min(2).max(255).optional(),
      description: z.string().optional().nullable(),
      kasType: z.string().optional().nullable(),
      currency: z.string().optional(),
      timezone: z.string().optional(),
      initialBalance: z.number().optional()
    });
    const body = await readBody(event);
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: validation.error.errors[0].message
      });
    }
    const updateData = { ...validation.data, updatedAt: /* @__PURE__ */ new Date() };
    if (updateData.initialBalance !== void 0) {
      updateData.initialBalance = updateData.initialBalance.toString();
    }
    const [updated] = await db.update(kasGroups).set(updateData).where(eq(kasGroups.id, kasId)).returning();
    return {
      success: true,
      message: "Kas berhasil diperbarui",
      data: updated
    };
  }
  if (method === "DELETE") {
    const { kas } = await requireKasAccess(event, ["OWNER"]);
    await db.update(kasGroups).set({ isArchived: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq(kasGroups.id, kasId));
    return {
      success: true,
      message: "Kas berhasil diarsipkan"
    };
  }
});

export { index as default, requireKasAccess };
//# sourceMappingURL=index.mjs.map
