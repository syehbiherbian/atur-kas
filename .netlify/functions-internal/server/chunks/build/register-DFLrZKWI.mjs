import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, computed, reactive, ref, mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRoute, b as useRouter } from './server.mjs';
import { u as useToast } from './useToast-BLGlIBV_.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './state-C15HQ2wM.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useToast();
    computed(() => route.query.redirect || "/dashboard");
    const loginLink = computed(() => {
      const redirect = route.query.redirect;
      return redirect ? `/login?redirect=${redirect}` : "/login";
    });
    const form = reactive({
      name: "",
      identifier: "",
      password: "",
      confirmPassword: ""
    });
    const isLoading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white flex flex-col" }, _attrs))} data-v-0d1c0d2e><header class="border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}" data-v-0d1c0d2e><div class="max-w-5xl mx-auto px-4 h-12 flex items-center" data-v-0d1c0d2e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-lg" data-v-0d1c0d2e${_scopeId}>💰</span><span class="font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}" data-v-0d1c0d2e${_scopeId}>Kas Juwita</span>`);
          } else {
            return [
              createVNode("span", { class: "text-lg" }, "💰"),
              createVNode("span", {
                class: "font-medium",
                style: { "color": "#37352F" }
              }, "Kas Juwita")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><div class="flex-1 flex items-center justify-center px-4 py-12" data-v-0d1c0d2e><div class="w-full" style="${ssrRenderStyle({ "max-width": "340px" })}" data-v-0d1c0d2e><h1 class="text-xl font-semibold text-center mb-6" style="${ssrRenderStyle({ "color": "#37352F" })}" data-v-0d1c0d2e>Buat akun baru</h1><form class="space-y-4" data-v-0d1c0d2e>`);
      if (unref(error)) {
        _push(`<div class="p-3 rounded-md text-sm" style="${ssrRenderStyle({ "background": "rgba(224, 62, 62, 0.08)", "color": "#E03E3E" })}" data-v-0d1c0d2e>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-v-0d1c0d2e><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-0d1c0d2e>Nama Lengkap</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Nama Anda" required data-v-0d1c0d2e></div><div data-v-0d1c0d2e><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-0d1c0d2e>Email atau No. HP</label><input${ssrRenderAttr("value", unref(form).identifier)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="you@example.com atau 08xxx" required data-v-0d1c0d2e></div><div data-v-0d1c0d2e><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-0d1c0d2e>Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Minimal 6 karakter" required data-v-0d1c0d2e></div><div data-v-0d1c0d2e><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-0d1c0d2e>Konfirmasi Password</label><input${ssrRenderAttr("value", unref(form).confirmPassword)} type="password" class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Ulangi password" required data-v-0d1c0d2e></div><button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-all" style="${ssrRenderStyle({ background: unref(isLoading) ? "#6BBDE6" : "#0A85D1", cursor: unref(isLoading) ? "not-allowed" : "pointer" })}" data-v-0d1c0d2e>${ssrInterpolate(unref(isLoading) ? "Memproses..." : "Daftar")}</button></form><p class="mt-6 text-center text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-0d1c0d2e> Sudah punya akun? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(loginLink),
        class: "hover:underline",
        style: { "color": "#0A85D1" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Masuk`);
          } else {
            return [
              createTextVNode("Masuk")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0d1c0d2e"]]);

export { register as default };
//# sourceMappingURL=register-DFLrZKWI.mjs.map
