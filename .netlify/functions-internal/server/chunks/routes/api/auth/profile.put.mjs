import { d as defineEventHandler, g as getMethod, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { r as requireAuth, u as useDb, a as users, v as verifyPassword, h as hashPassword } from '../../../_/auth.mjs';
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

const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(255),
  email: z.string().email("Email tidak valid").optional().nullable(),
  phone: z.string().min(10, "Nomor HP minimal 10 digit").max(20).optional().nullable(),
  currentPassword: z.string().optional().nullable(),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter").optional().nullable()
}).refine((data) => data.email || data.phone, {
  message: "Email atau nomor HP harus diisi"
});
const profile_put = defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method !== "PUT") {
    throw createError({
      statusCode: 405,
      message: "Method not allowed"
    });
  }
  const currentUser = await requireAuth(event);
  const db = useDb();
  const body = await readBody(event);
  const validation = updateProfileSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: validation.error.errors[0].message
    });
  }
  const { name, email, phone, currentPassword, newPassword } = validation.data;
  if (email || phone) {
    const existingUser = await db.query.users.findFirst({
      where: (users2, { or: or2, eq: eq2, and: and2, ne: ne2 }) => {
        const conditions = [];
        if (email) conditions.push(eq2(users2.email, email));
        if (phone) conditions.push(eq2(users2.phone, phone));
        return and2(
          or2(...conditions),
          ne2(users2.id, currentUser.id)
        );
      }
    });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email atau nomor HP sudah digunakan"
      });
    }
  }
  const updateData = {
    name,
    email: email || null,
    phone: phone || null,
    updatedAt: /* @__PURE__ */ new Date()
  };
  if (newPassword) {
    if (!currentPassword) {
      throw createError({
        statusCode: 400,
        message: "Password lama harus diisi untuk ganti password"
      });
    }
    const userWithPassword = await db.query.users.findFirst({
      where: eq(users.id, currentUser.id)
    });
    if (!userWithPassword) {
      throw createError({
        statusCode: 404,
        message: "User tidak ditemukan"
      });
    }
    const isValidPassword = await verifyPassword(currentPassword, userWithPassword.passwordHash);
    if (!isValidPassword) {
      throw createError({
        statusCode: 400,
        message: "Password lama salah"
      });
    }
    updateData.passwordHash = await hashPassword(newPassword);
  }
  const [updatedUser] = await db.update(users).set(updateData).where(eq(users.id, currentUser.id)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    phone: users.phone
  });
  return {
    success: true,
    message: "Profile berhasil diperbarui",
    user: updatedUser
  };
});

export { profile_put as default };
//# sourceMappingURL=profile.put.mjs.map
