import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { c as clearAuthCookie } from '../../../_/auth.mjs';
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

const logout_post = defineEventHandler(async (event) => {
  clearAuthCookie(event);
  return {
    success: true,
    message: "Logout berhasil"
  };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
