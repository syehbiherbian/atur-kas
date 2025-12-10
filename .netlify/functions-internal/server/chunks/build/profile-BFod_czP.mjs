import { defineComponent, reactive, ref, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-od92F8JB.mjs';
import { _ as _export_sfc } from './server.mjs';
import './state-C15HQ2wM.mjs';
import './fetch-Cc0ziM8v.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@vue/shared';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const form = reactive({
      name: user.value?.name || "",
      email: user.value?.email || "",
      phone: user.value?.phone || "",
      currentPassword: "",
      newPassword: ""
    });
    const isLoading = ref(false);
    const error = ref("");
    const successMsg = ref("");
    watch(user, (newUser) => {
      if (newUser) {
        form.name = newUser.name || "";
        form.email = newUser.email || "";
        form.phone = newUser.phone || "";
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-1e36622b><div class="mb-6" data-v-1e36622b><h1 class="text-xl font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}" data-v-1e36622b>Edit Profile</h1><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-1e36622b>Kelola informasi akun Anda</p></div><div class="rounded-lg border p-6" style="${ssrRenderStyle({ "max-width": "480px", "border-color": "rgba(55, 53, 47, 0.09)" })}" data-v-1e36622b><form class="space-y-4" data-v-1e36622b>`);
      if (unref(error)) {
        _push(`<div class="p-3 rounded-md text-sm" style="${ssrRenderStyle({ "background": "rgba(224, 62, 62, 0.08)", "color": "#E03E3E" })}" data-v-1e36622b>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMsg)) {
        _push(`<div class="p-3 rounded-md text-sm" style="${ssrRenderStyle({ "background": "rgba(15, 123, 108, 0.08)", "color": "#0F7B6C" })}" data-v-1e36622b>${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-v-1e36622b><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-1e36622b>Nama Lengkap</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" required data-v-1e36622b></div><div data-v-1e36622b><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-1e36622b>Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="email@example.com" data-v-1e36622b></div><div data-v-1e36622b><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-1e36622b>No. HP</label><input${ssrRenderAttr("value", unref(form).phone)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="08xxx" data-v-1e36622b></div><div class="border-t pt-4 mt-4" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}" data-v-1e36622b><h3 class="text-sm font-medium mb-3" style="${ssrRenderStyle({ "color": "#37352F" })}" data-v-1e36622b>Ganti Password</h3><div class="space-y-3" data-v-1e36622b><div data-v-1e36622b><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-1e36622b>Password Lama</label><input${ssrRenderAttr("value", unref(form).currentPassword)} type="password" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Kosongkan jika tidak ingin ganti" data-v-1e36622b></div><div data-v-1e36622b><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-1e36622b>Password Baru</label><input${ssrRenderAttr("value", unref(form).newPassword)} type="password" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Minimal 6 karakter" data-v-1e36622b></div></div></div><div class="pt-2" data-v-1e36622b><button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="px-4 py-2 text-sm font-medium text-white rounded-md transition" style="${ssrRenderStyle({ background: unref(isLoading) ? "#6BBDE6" : "#0A85D1", cursor: unref(isLoading) ? "not-allowed" : "pointer" })}" data-v-1e36622b>${ssrInterpolate(unref(isLoading) ? "Menyimpan..." : "Simpan Perubahan")}</button></div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1e36622b"]]);

export { profile as default };
//# sourceMappingURL=profile-BFod_czP.mjs.map
