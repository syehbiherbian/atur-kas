import { d as defineEventHandler, g as getMethod, a as getRouterParam, r as readBody, c as createError, b as getQuery } from '../../../../nitro/nitro.mjs';
import { z } from 'zod';
import { and, eq, desc } from 'drizzle-orm';
import { u as useDb, k as kasMembers, h as hashPassword, a as users } from '../../../../_/auth.mjs';
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

const members = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const kasId = getRouterParam(event, "id");
  const db = useDb();
  if (method === "POST") {
    const { kas, role: currentUserRole } = await requireKasAccess(event, ["OWNER"]);
    const addMemberSchema = z.object({
      name: z.string().min(2, "Nama minimal 2 karakter").max(255),
      phone: z.string().min(10, "Nomor HP minimal 10 digit").max(20).optional().nullable(),
      email: z.string().email("Email tidak valid").optional().nullable(),
      password: z.string().min(6, "Password minimal 6 karakter"),
      role: z.enum(["ADMIN", "MEMBER"])
    }).refine((data) => data.email || data.phone, {
      message: "Email atau nomor HP harus diisi"
    });
    const body = await readBody(event);
    const validation = addMemberSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: validation.error.errors[0].message
      });
    }
    const { name, phone, email, password, role } = validation.data;
    let existingUser = await db.query.users.findFirst({
      where: (users2, { or: or2, eq: eq2 }) => {
        const conditions = [];
        if (email) conditions.push(eq2(users2.email, email));
        if (phone) conditions.push(eq2(users2.phone, phone));
        return conditions.length > 0 ? or2(...conditions) : void 0;
      }
    });
    let userId;
    if (existingUser) {
      const existingMember = await db.query.kasMembers.findFirst({
        where: and(
          eq(kasMembers.kasId, kasId),
          eq(kasMembers.userId, existingUser.id)
        )
      });
      if (existingMember && existingMember.status === "ACTIVE") {
        throw createError({
          statusCode: 400,
          message: "Pengguna sudah menjadi anggota kas ini"
        });
      }
      userId = existingUser.id;
    } else {
      const hashedPassword = await hashPassword(password);
      const [newUser] = await db.insert(users).values({
        name,
        phone: phone || null,
        email: email || null,
        passwordHash: hashedPassword
      }).returning();
      userId = newUser.id;
    }
    const [newMember] = await db.insert(kasMembers).values({
      kasId,
      userId,
      role,
      status: "ACTIVE",
      joinedAt: /* @__PURE__ */ new Date()
    }).returning();
    const memberWithUser = await db.query.kasMembers.findFirst({
      where: eq(kasMembers.id, newMember.id),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    return {
      success: true,
      message: "Anggota berhasil ditambahkan",
      data: memberWithUser
    };
  }
  if (method === "GET") {
    const { kas } = await requireKasAccess(event);
    const members = await db.query.kasMembers.findMany({
      where: eq(kasMembers.kasId, kasId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true
          }
        }
      },
      orderBy: [desc(kasMembers.joinedAt)]
    });
    return {
      success: true,
      data: members.map((m) => ({
        id: m.id,
        userId: m.userId,
        role: m.role,
        status: m.status,
        joinedAt: m.joinedAt,
        leftAt: m.leftAt,
        user: m.user
      }))
    };
  }
  if (method === "PUT") {
    const { kas, role: currentUserRole } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const updateSchema = z.object({
      memberId: z.string().uuid(),
      role: z.enum(["ADMIN", "MEMBER"]).optional(),
      status: z.enum(["ACTIVE", "SUSPENDED"]).optional()
    });
    const body = await readBody(event);
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        message: validation.error.errors[0].message
      });
    }
    const { memberId, role, status } = validation.data;
    const targetMember = await db.query.kasMembers.findFirst({
      where: and(
        eq(kasMembers.id, memberId),
        eq(kasMembers.kasId, kasId)
      )
    });
    if (!targetMember) {
      throw createError({
        statusCode: 404,
        message: "Member tidak ditemukan"
      });
    }
    if (targetMember.role === "OWNER") {
      throw createError({
        statusCode: 403,
        message: "Tidak dapat mengubah owner kas"
      });
    }
    if (role && currentUserRole !== "OWNER") {
      throw createError({
        statusCode: 403,
        message: "Hanya owner yang dapat mengubah role"
      });
    }
    const updateData = {};
    if (role) updateData.role = role;
    if (status) {
      updateData.status = status;
      if (status === "SUSPENDED") {
        updateData.leftAt = /* @__PURE__ */ new Date();
      }
    }
    const [updated] = await db.update(kasMembers).set(updateData).where(eq(kasMembers.id, memberId)).returning();
    return {
      success: true,
      message: "Member berhasil diperbarui",
      data: updated
    };
  }
  if (method === "DELETE") {
    const { kas } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const memberId = getQuery(event).memberId;
    if (!memberId) {
      throw createError({
        statusCode: 400,
        message: "Member ID is required"
      });
    }
    const targetMember = await db.query.kasMembers.findFirst({
      where: and(
        eq(kasMembers.id, memberId),
        eq(kasMembers.kasId, kasId)
      )
    });
    if (!targetMember) {
      throw createError({
        statusCode: 404,
        message: "Member tidak ditemukan"
      });
    }
    if (targetMember.role === "OWNER") {
      throw createError({
        statusCode: 403,
        message: "Tidak dapat menghapus owner kas"
      });
    }
    await db.update(kasMembers).set({ status: "LEFT", leftAt: /* @__PURE__ */ new Date() }).where(eq(kasMembers.id, memberId));
    return {
      success: true,
      message: "Member berhasil dihapus"
    };
  }
});

export { members as default };
//# sourceMappingURL=members.mjs.map
