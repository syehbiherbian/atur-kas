import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, computed, withAsyncContext, ref, mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useRoute, b as useRouter } from './server.mjs';
import { u as useToast } from './useToast-BLGlIBV_.mjs';
import { u as useFetch } from './fetch-Cc0ziM8v.mjs';
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
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[token]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    useToast();
    const token = computed(() => route.params.token);
    const { data: authData } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/auth/me", "$i9V8kP7htB")), __temp = await __temp, __restore(), __temp);
    const isLoggedIn = computed(() => !!authData.value?.data);
    const { data: inviteResponse, pending, error: fetchError } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/join/${token.value}`, "$TE44BFOKWP")), __temp = await __temp, __restore(), __temp);
    const invitation = computed(() => inviteResponse.value?.data);
    const error = computed(() => fetchError.value?.data?.message || (fetchError.value ? "Undangan tidak valid" : null));
    const isJoining = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white flex flex-col" }, _attrs))}><header class="border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="max-w-5xl mx-auto px-4 h-12 flex items-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-lg"${_scopeId}>💰</span><span class="font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}"${_scopeId}>Kas Juwita</span>`);
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
      _push(`</div></header><div class="flex-1 flex items-center justify-center px-4 py-12"><div class="w-full" style="${ssrRenderStyle({ "max-width": "340px" })}">`);
      if (unref(pending)) {
        _push(`<div class="text-center" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Memuat... </div>`);
      } else if (unref(error)) {
        _push(`<div class="text-center"><div class="text-4xl mb-4">❌</div><h1 class="text-xl font-semibold mb-2" style="${ssrRenderStyle({ "color": "#37352F" })}">Undangan Tidak Valid</h1><p class="text-sm mb-6" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(unref(error))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-block px-4 py-2 text-sm font-medium text-white rounded-md",
          style: { "background": "#0A85D1" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Kembali`);
            } else {
              return [
                createTextVNode("Kembali")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="text-center"><div class="text-4xl mb-4">📨</div><h1 class="text-xl font-semibold mb-2" style="${ssrRenderStyle({ "color": "#37352F" })}">Undangan Kas</h1><p class="text-sm mb-6" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Anda diundang ke <span class="font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(unref(invitation)?.kas?.name)}</span></p>`);
        if (unref(isLoggedIn)) {
          _push(`<div class="space-y-3"><button${ssrIncludeBooleanAttr(unref(isJoining)) ? " disabled" : ""} class="w-full px-4 py-2 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}">${ssrInterpolate(unref(isJoining) ? "Bergabung..." : "Gabung Sekarang")}</button></div>`);
        } else {
          _push(`<div class="space-y-3">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/login?redirect=/join/${unref(token)}`,
            class: "block w-full px-4 py-2 text-sm font-medium text-white text-center rounded-md",
            style: { "background": "#0A85D1" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Masuk untuk Bergabung `);
              } else {
                return [
                  createTextVNode(" Masuk untuk Bergabung ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/register?redirect=/join/${unref(token)}`,
            class: "block w-full px-4 py-2 text-sm font-medium text-center rounded-md",
            style: { "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Daftar Akun Baru `);
              } else {
                return [
                  createTextVNode(" Daftar Akun Baru ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        }
        _push(`</div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/join/[token].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_token_-DMS9KFdI.mjs.map
