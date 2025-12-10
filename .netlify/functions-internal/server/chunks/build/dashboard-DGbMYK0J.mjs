import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, withAsyncContext, computed, ref, reactive, unref, withCtx, createVNode, createBlock, toDisplayString, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
import './server.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useToast();
    const { data: kasResponse, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/kas", "$2YOI5wd6j1")), __temp = await __temp, __restore(), __temp);
    const kasList = computed(() => kasResponse.value?.data || []);
    const showCreateModal = ref(false);
    const isCreating = ref(false);
    const createForm = reactive({
      name: "",
      description: "",
      initialBalance: 0
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-xl font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}">Dashboard</h1><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Kelola kas grup Anda</p></div><div class="mb-6"><button class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}"> + Buat Kas Baru </button></div>`);
      if (unref(pending)) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="rounded-lg border p-4" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="h-5 rounded w-40 mb-2 animate-pulse" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)" })}"></div><div class="h-4 rounded w-24 animate-pulse" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)" })}"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(kasList)?.length) {
        _push(`<div class="text-center py-16"><div class="text-4xl mb-4">💰</div><h3 class="text-lg font-medium mb-2" style="${ssrRenderStyle({ "color": "#37352F" })}">Belum ada kas</h3><p class="text-sm mb-6" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Buat kas pertama untuk mulai mengelola keuangan</p><button class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}"> Buat Kas Pertama </button></div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(kasList), (kas) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: kas.id,
            to: `/kas/${kas.id}`,
            class: "rounded-lg border p-4 flex items-center justify-between block hover:bg-gray-50 transition",
            style: { "border-color": "rgba(55, 53, 47, 0.09)" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center gap-3"${_scopeId}><div class="w-9 h-9 rounded-md flex items-center justify-center text-lg" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.03)" })}"${_scopeId}>💰</div><div${_scopeId}><h3 class="font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}"${_scopeId}>${ssrInterpolate(kas.name)}</h3><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"${_scopeId}>${ssrInterpolate(kas.memberCount || 0)} anggota</p></div></div><svg class="w-5 h-5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.4)" })}" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"${_scopeId}></path></svg>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", {
                      class: "w-9 h-9 rounded-md flex items-center justify-center text-lg",
                      style: { "background": "rgba(55, 53, 47, 0.03)" }
                    }, "💰"),
                    createVNode("div", null, [
                      createVNode("h3", {
                        class: "font-medium",
                        style: { "color": "#37352F" }
                      }, toDisplayString(kas.name), 1),
                      createVNode("p", {
                        class: "text-sm",
                        style: { "color": "rgba(55, 53, 47, 0.65)" }
                      }, toDisplayString(kas.memberCount || 0) + " anggota", 1)
                    ])
                  ]),
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5",
                    style: { "color": "rgba(55, 53, 47, 0.4)" },
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M9 5l7 7-7 7"
                    })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showCreateModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="${ssrRenderStyle({ "background": "rgba(15, 15, 15, 0.6)" })}"><div class="bg-white rounded-lg w-full p-5" style="${ssrRenderStyle({ "max-width": "400px", "box-shadow": "rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px" })}"><h2 class="text-lg font-semibold mb-5" style="${ssrRenderStyle({ "color": "#37352F" })}">Buat Kas Baru</h2><form class="space-y-4"><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Nama Kas</label><input${ssrRenderAttr("value", unref(createForm).name)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Contoh: Kas RT 05" required></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Deskripsi (Opsional)</label><textarea class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" rows="2" placeholder="Deskripsi singkat">${ssrInterpolate(unref(createForm).description)}</textarea></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Saldo Awal</label><input${ssrRenderAttr("value", unref(createForm).initialBalance)} type="number" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="0" min="0"></div><div class="flex gap-2 pt-2"><button type="button" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" })}">Batal</button><button type="submit"${ssrIncludeBooleanAttr(unref(isCreating)) ? " disabled" : ""} class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}">${ssrInterpolate(unref(isCreating) ? "Membuat..." : "Buat")}</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-DGbMYK0J.mjs.map
