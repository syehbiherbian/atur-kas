import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { u as useDb, v as verifyPassword, g as generateToken, s as setAuthCookie } from '../../../_/auth.mjs';
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

const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau nomor HP harus diisi"),
  password: z.string().min(1, "Password harus diisi")
});
const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      message: validation.error.errors[0].message
    });
  }
  const { identifier, password } = validation.data;
  const db = useDb();
  const user = await db.query.users.findFirst({
    where: (users, { or, eq }) => or(
      eq(users.email, identifier),
      eq(users.phone, identifier)
    )
  });
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Email/nomor HP atau password salah"
    });
  }
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Email/nomor HP atau password salah"
    });
  }
  const token = generateToken({
    userId: user.id,
    email: user.email || void 0,
    phone: user.phone || void 0
  });
  setAuthCookie(event, token);
  return {
    success: true,
    message: "Login berhasil",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl
    },
    token
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
