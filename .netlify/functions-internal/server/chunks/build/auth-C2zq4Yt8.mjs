import { z as executeAsync } from '../nitro/nitro.mjs';
import { d as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useAuth } from './useAuth-od92F8JB.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './state-C15HQ2wM.mjs';
import './fetch-Cc0ziM8v.mjs';
import '@vue/shared';
import 'perfect-debounce';

const auth = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const { user, fetchUser, isLoading } = useAuth();
  if (!user.value && !isLoading.value) {
    [__temp, __restore] = executeAsync(() => fetchUser()), await __temp, __restore();
  }
  if (!user.value) {
    return navigateTo("/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-C2zq4Yt8.mjs.map
