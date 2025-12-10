import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, unref, createBlock, createTextVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { b as useRouter } from './server.mjs';
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
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useToast();
    const { user } = useAuth();
    const showMenu = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}><header class="sticky top-0 z-50 bg-white border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
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
      if (unref(user)) {
        _push(`<div class="relative"><button class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 transition"><div class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" })}">${ssrInterpolate(unref(user).name?.charAt(0)?.toUpperCase() || "?")}</div><span class="text-sm hidden sm:block" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(unref(user).name)}</span><svg class="w-4 h-4" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.5)" })}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>`);
        if (unref(showMenu)) {
          _push(`<div class="absolute right-0 mt-1 w-48 bg-white rounded-lg border py-1 shadow-lg" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="px-3 py-2 border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><p class="text-sm font-medium truncate" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(unref(user).name)}</p><p class="text-xs truncate" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(unref(user).email || unref(user).phone)}</p></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile",
            onClick: ($event) => showMenu.value = false,
            class: "flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition",
            style: { "color": "#37352F" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg> Edit Profile `);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    })
                  ])),
                  createTextVNode(" Edit Profile ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<button class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition text-left" style="${ssrRenderStyle({ "color": "#E03E3E" })}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Keluar </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header>`);
      if (unref(showMenu)) {
        _push(`<div class="fixed inset-0 z-40"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="max-w-5xl mx-auto px-4 py-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-Dqu0R5oA.mjs.map
