import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { u as useDb, h as hashPassword, a as users, g as generateToken, s as setAuthCookie } from '../../../_/auth.mjs';
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
import 'drizzle-orm';

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(255),
  email: z.string().email("Email tidak valid").optional().nullable(),
  phone: z.string().min(10, "Nomor HP minimal 10 digit").max(20).optional().nullable(),
  password: z.string().min(6, "Password minimal 6 karakter")
}).refine((data) => data.email || data.phone, {
  message: "Email atau nomor HP harus diisi"
});
const register_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = registerSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      message: validation.error.errors[0].message
    });
  }
  const { name, email, phone, password } = validation.data;
  const db = useDb();
  const existingUser = await db.query.users.findFirst({
    where: (users2, { or: or2, eq: eq2 }) => {
      const conditions = [];
      if (email) conditions.push(eq2(users2.email, email));
      if (phone) conditions.push(eq2(users2.phone, phone));
      return conditions.length > 0 ? or2(...conditions) : void 0;
    }
  });
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "Conflict",
      message: "Email atau nomor HP sudah terdaftar"
    });
  }
  const passwordHash = await hashPassword(password);
  const [newUser] = await db.insert(users).values({
    name,
    email: email || null,
    phone: phone || null,
    passwordHash
  }).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    phone: users.phone,
    avatarUrl: users.avatarUrl
  });
  const token = generateToken({
    userId: newUser.id,
    email: newUser.email || void 0,
    phone: newUser.phone || void 0
  });
  setAuthCookie(event, token);
  return {
    success: true,
    message: "Registrasi berhasil",
    user: newUser,
    token
  };
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
