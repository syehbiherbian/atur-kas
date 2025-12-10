import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, computed, reactive, ref, mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRoute, b as useRouter } from './server.mjs';
import { u as useToast } from './useToast-BLGlIBV_.mjs';
import { u as useAuth } from './useAuth-od92F8JB.mjs';
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
import './fetch-Cc0ziM8v.mjs';
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useToast();
    computed(() => route.query.redirect || "/dashboard");
    const registerLink = computed(() => {
      const redirect = route.query.redirect;
      return redirect ? `/register?redirect=${redirect}` : "/register";
    });
    const form = reactive({
      identifier: "",
      password: ""
    });
    const isLoading = ref(false);
    const error = ref("");
    useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white flex flex-col" }, _attrs))} data-v-c84535a8><header class="border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}" data-v-c84535a8><div class="max-w-5xl mx-auto px-4 h-12 flex items-center" data-v-c84535a8>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-lg" data-v-c84535a8${_scopeId}>💰</span><span class="font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}" data-v-c84535a8${_scopeId}>Kas Juwita</span>`);
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
      _push(`</div></header><div class="flex-1 flex items-center justify-center px-4 py-12" data-v-c84535a8><div class="w-full" style="${ssrRenderStyle({ "max-width": "340px" })}" data-v-c84535a8><h1 class="text-xl font-semibold text-center mb-6" style="${ssrRenderStyle({ "color": "#37352F" })}" data-v-c84535a8>Masuk ke akun Anda</h1><form class="space-y-4" data-v-c84535a8>`);
      if (unref(error)) {
        _push(`<div class="p-3 rounded-md text-sm" style="${ssrRenderStyle({ "background": "rgba(224, 62, 62, 0.08)", "color": "#E03E3E" })}" data-v-c84535a8>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-v-c84535a8><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-c84535a8>Email atau No. HP</label><input${ssrRenderAttr("value", unref(form).identifier)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="you@example.com" required data-v-c84535a8></div><div data-v-c84535a8><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-c84535a8>Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="••••••••" required data-v-c84535a8></div><button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-all" style="${ssrRenderStyle({ background: unref(isLoading) ? "#6BBDE6" : "#0A85D1", cursor: unref(isLoading) ? "not-allowed" : "pointer" })}" data-v-c84535a8>${ssrInterpolate(unref(isLoading) ? "Memproses..." : "Masuk")}</button></form><p class="mt-6 text-center text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}" data-v-c84535a8> Belum punya akun? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(registerLink),
        class: "hover:underline",
        style: { "color": "#0A85D1" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Daftar`);
          } else {
            return [
              createTextVNode("Daftar")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c84535a8"]]);

export { login as default };
//# sourceMappingURL=login-CHjhmUsy.mjs.map
