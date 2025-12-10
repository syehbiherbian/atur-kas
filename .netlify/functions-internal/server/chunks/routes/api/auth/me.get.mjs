import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.mjs';
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

const me_get = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  return {
    success: true,
    user
  };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
