import { d as defineEventHandler, g as getMethod, a as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { eq, and, sql } from 'drizzle-orm';
import { u as useDb, i as invitations, b as getAuthUser, k as kasMembers, r as requireAuth } from '../../../_/auth.mjs';
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

const _token_ = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const token = getRouterParam(event, "token");
  const db = useDb();
  if (!token) {
    throw createError({
      statusCode: 400,
      message: "Token undangan tidak valid"
    });
  }
  if (method === "GET") {
    const invite = await db.query.invitations.findFirst({
      where: eq(invitations.inviteToken, token),
      with: {
        kas: {
          columns: {
            id: true,
            name: true,
            description: true,
            kasType: true
          }
        }
      }
    });
    if (!invite) {
      throw createError({
        statusCode: 404,
        message: "Undangan tidak ditemukan"
      });
    }
    if (invite.expiresAt && new Date(invite.expiresAt) < /* @__PURE__ */ new Date()) {
      throw createError({
        statusCode: 410,
        message: "Undangan sudah kedaluwarsa"
      });
    }
    if (invite.maxUses && invite.usedCount >= invite.maxUses) {
      throw createError({
        statusCode: 410,
        message: "Undangan sudah mencapai batas penggunaan"
      });
    }
    const user = await getAuthUser(event);
    let isMember = false;
    if (user) {
      const existingMember = await db.query.kasMembers.findFirst({
        where: and(
          eq(kasMembers.kasId, invite.kasId),
          eq(kasMembers.userId, user.id)
        )
      });
      isMember = !!existingMember;
    }
    return {
      success: true,
      data: {
        kasId: invite.kas.id,
        kasName: invite.kas.name,
        kasDescription: invite.kas.description,
        kasType: invite.kas.kasType,
        isLoggedIn: !!user,
        isMember
      }
    };
  }
  if (method === "POST") {
    const user = await requireAuth(event);
    const invite = await db.query.invitations.findFirst({
      where: eq(invitations.inviteToken, token)
    });
    if (!invite) {
      throw createError({
        statusCode: 404,
        message: "Undangan tidak ditemukan"
      });
    }
    if (invite.expiresAt && new Date(invite.expiresAt) < /* @__PURE__ */ new Date()) {
      throw createError({
        statusCode: 410,
        message: "Undangan sudah kedaluwarsa"
      });
    }
    if (invite.maxUses && invite.usedCount >= invite.maxUses) {
      throw createError({
        statusCode: 410,
        message: "Undangan sudah mencapai batas penggunaan"
      });
    }
    const existingMember = await db.query.kasMembers.findFirst({
      where: and(
        eq(kasMembers.kasId, invite.kasId),
        eq(kasMembers.userId, user.id)
      )
    });
    if (existingMember) {
      if (existingMember.status === "ACTIVE") {
        throw createError({
          statusCode: 409,
          message: "Anda sudah menjadi anggota kas ini"
        });
      }
      await db.update(kasMembers).set({ status: "ACTIVE", leftAt: null }).where(eq(kasMembers.id, existingMember.id));
    } else {
      await db.insert(kasMembers).values({
        kasId: invite.kasId,
        userId: user.id,
        role: "MEMBER",
        status: "ACTIVE"
      });
    }
    await db.update(invitations).set({ usedCount: sql`${invitations.usedCount} + 1` }).where(eq(invitations.id, invite.id));
    return {
      success: true,
      message: "Berhasil bergabung ke kas",
      kasId: invite.kasId
    };
  }
});

export { _token_ as default };
//# sourceMappingURL=_token_.mjs.map
