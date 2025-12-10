import { d as defineEventHandler, g as getMethod, a as getRouterParam, r as readBody, u as useRuntimeConfig, b as getQuery, c as createError } from '../../../../nitro/nitro.mjs';
import { and, eq, gt } from 'drizzle-orm';
import { u as useDb, i as invitations } from '../../../../_/auth.mjs';
import { requireKasAccess } from '../index.mjs';
import { nanoid } from 'nanoid';
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

const generateInviteToken = () => {
  return nanoid(16);
};

const invite = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const kasId = getRouterParam(event, "id");
  const db = useDb();
  if (method === "GET") {
    const { kas } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const activeInvites = await db.query.invitations.findMany({
      where: and(
        eq(invitations.kasId, kasId),
        gt(invitations.expiresAt, /* @__PURE__ */ new Date())
      )
    });
    return {
      success: true,
      data: activeInvites
    };
  }
  if (method === "POST") {
    const { user, kas } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const config = useRuntimeConfig();
    const body = await readBody(event) || {};
    const expiresInDays = (body == null ? void 0 : body.expiresInDays) || 7;
    const maxUses = (body == null ? void 0 : body.maxUses) || null;
    const token = generateInviteToken();
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    const [newInvite] = await db.insert(invitations).values({
      kasId,
      inviteToken: token,
      expiresAt,
      maxUses,
      createdBy: user.id
    }).returning();
    const inviteLink = `${config.public.appUrl}/join/${token}`;
    const waMessage = `Halo! Yuk gabung ke Kas "${kas.name}". Klik link berikut untuk bergabung:
${inviteLink}`;
    const waShareLink = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
    return {
      success: true,
      data: {
        ...newInvite,
        inviteLink,
        waShareLink,
        waMessage
      }
    };
  }
  if (method === "DELETE") {
    const { kas } = await requireKasAccess(event, ["OWNER", "ADMIN"]);
    const inviteId = getQuery(event).inviteId;
    if (!inviteId) {
      throw createError({
        statusCode: 400,
        message: "Invite ID is required"
      });
    }
    await db.delete(invitations).where(and(
      eq(invitations.id, inviteId),
      eq(invitations.kasId, kasId)
    ));
    return {
      success: true,
      message: "Undangan berhasil dibatalkan"
    };
  }
});

export { invite as default };
//# sourceMappingURL=invite.mjs.map
