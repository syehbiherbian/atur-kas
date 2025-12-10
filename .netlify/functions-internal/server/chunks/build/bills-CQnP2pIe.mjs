import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, computed, withAsyncContext, ref, reactive, withCtx, createBlock, openBlock, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { f as formatDate, a as formatCurrency } from './formatters-C4QdAViG.mjs';
import { a as useRoute } from './server.mjs';
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
  __name: "bills",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const kasId = computed(() => route.params.id);
    useToast();
    const { data: kasResponse } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}`, "$r3ZxOmsUhn")), __temp = await __temp, __restore(), __temp);
    const canManage = computed(() => ["OWNER", "ADMIN"].includes(kasResponse.value?.data?.currentUserRole));
    const { data: billsResponse, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}/bills`, "$zx-KPg_H8R")), __temp = await __temp, __restore(), __temp);
    const bills = computed(() => billsResponse.value?.data || []);
    const showCreateModal = ref(false);
    const isCreating = ref(false);
    const createForm = reactive({
      name: "",
      amountDefault: null,
      dueDate: ""
    });
    const showPayModal = ref(false);
    const isPaying = ref(false);
    const selectedBill = ref(null);
    const selectedItem = ref(null);
    const payForm = reactive({ amount: 0 });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center gap-3 mb-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "p-1.5 rounded-md hover:bg-gray-100 transition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-5 h-5" style="${ssrRenderStyle({ "color": "#37352F" })}" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-5 h-5",
                style: { "color": "#37352F" },
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M15 19l-7-7 7-7"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><h1 class="text-lg font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}">Tagihan</h1><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Kelola iuran anggota</p></div></div><div class="flex gap-1 mb-6 border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/kas/${unref(kasId)}`,
        class: "px-3 py-2 text-sm font-medium transition",
        style: { "color": "rgba(55, 53, 47, 0.65)" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dashboard`);
          } else {
            return [
              createTextVNode("Dashboard")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/kas/${unref(kasId)}/transactions`,
        class: "px-3 py-2 text-sm font-medium transition",
        style: { "color": "rgba(55, 53, 47, 0.65)" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Transaksi`);
          } else {
            return [
              createTextVNode("Transaksi")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/kas/${unref(kasId)}/members`,
        class: "px-3 py-2 text-sm font-medium transition",
        style: { "color": "rgba(55, 53, 47, 0.65)" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Anggota`);
          } else {
            return [
              createTextVNode("Anggota")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/kas/${unref(kasId)}/bills`,
        class: "px-3 py-2 text-sm font-medium -mb-px",
        style: { "color": "#37352F", "border-bottom": "2px solid #0A85D1" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Tagihan`);
          } else {
            return [
              createTextVNode("Tagihan")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(canManage)) {
        _push(`<div class="mb-6"><button class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}"> + Buat Tagihan </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(pending)) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(2, (i) => {
          _push(`<div class="rounded-lg border p-4" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="h-5 rounded w-40 mb-2 animate-pulse" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)" })}"></div><div class="h-4 rounded w-28 animate-pulse" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)" })}"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(bills)?.length) {
        _push(`<div class="text-center py-16 text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Belum ada tagihan </div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(bills), (bill) => {
          _push(`<div class="rounded-lg border p-5" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="flex items-start justify-between mb-4"><div><h3 class="font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(bill.name)}</h3><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">📅 Jatuh tempo: ${ssrInterpolate(unref(formatDate)(bill.dueDate))}</p></div><div class="text-right"><p class="text-lg font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(unref(formatCurrency)(bill.amountDefault))}</p><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">per anggota</p></div></div><div class="mb-4"><div class="flex justify-between text-sm mb-1.5"><span style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Terkumpul: ${ssrInterpolate(unref(formatCurrency)(bill.stats.paidAmount))}</span><span class="font-medium" style="${ssrRenderStyle({ color: bill.stats.percentage >= 100 ? "#0F7B6C" : "#37352F" })}">${ssrInterpolate(bill.stats.percentage)}%</span></div><div class="w-full h-1 rounded-full overflow-hidden" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)" })}"><div class="h-full rounded-full transition-all" style="${ssrRenderStyle({ width: `${Math.min(bill.stats.percentage, 100)}%`, background: bill.stats.percentage >= 100 ? "#0F7B6C" : "#0A85D1" })}"></div></div></div><div class="flex gap-2 text-xs mb-4 pb-4 border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><span class="px-2 py-1 rounded" style="${ssrRenderStyle({ "background": "rgba(15, 123, 108, 0.1)", "color": "#0F7B6C" })}">✓ ${ssrInterpolate(bill.stats.paidCount)} Lunas</span><span class="px-2 py-1 rounded" style="${ssrRenderStyle({ "background": "rgba(203, 145, 47, 0.1)", "color": "#CB912F" })}">⏳ ${ssrInterpolate(bill.stats.partialCount)} Sebagian</span><span class="px-2 py-1 rounded" style="${ssrRenderStyle({ "background": "rgba(224, 62, 62, 0.1)", "color": "#E03E3E" })}">✗ ${ssrInterpolate(bill.stats.unpaidCount)} Belum</span></div><div class="space-y-2"><!--[-->`);
          ssrRenderList(bill.items, (item) => {
            _push(`<div class="flex items-center justify-between p-3 rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.03)" })}"><div class="flex items-center gap-3"><div class="w-7 h-7 rounded flex items-center justify-center text-xs font-medium" style="${ssrRenderStyle({ "background": "#fff", "color": "#37352F" })}">${ssrInterpolate(item.member?.user?.name?.charAt(0)?.toUpperCase() || "?")}</div><div><p class="text-sm font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(item.member?.user?.name)}</p></div></div><div class="flex items-center gap-2"><span class="px-2 py-0.5 text-xs font-medium rounded" style="${ssrRenderStyle({
              background: item.status === "PAID" ? "rgba(15, 123, 108, 0.1)" : item.status === "PARTIAL" ? "rgba(203, 145, 47, 0.1)" : "rgba(224, 62, 62, 0.1)",
              color: item.status === "PAID" ? "#0F7B6C" : item.status === "PARTIAL" ? "#CB912F" : "#E03E3E"
            })}">${ssrInterpolate(item.status === "PAID" ? "Lunas" : item.status === "PARTIAL" ? "Sebagian" : "Belum")}</span>`);
            if (item.status !== "PAID" && unref(canManage)) {
              _push(`<button class="px-2 py-1 text-xs font-medium text-white rounded" style="${ssrRenderStyle({ "background": "#0F7B6C" })}"> Bayar </button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showCreateModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="${ssrRenderStyle({ "background": "rgba(15, 15, 15, 0.6)" })}"><div class="bg-white rounded-lg w-full p-5" style="${ssrRenderStyle({ "max-width": "400px", "box-shadow": "rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px" })}"><h2 class="text-lg font-semibold mb-5" style="${ssrRenderStyle({ "color": "#37352F" })}">Buat Tagihan Baru</h2><form class="space-y-4"><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Nama Tagihan</label><input${ssrRenderAttr("value", unref(createForm).name)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Contoh: Iuran Januari" required></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Nominal</label><input${ssrRenderAttr("value", unref(createForm).amountDefault)} type="number" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" min="1" required></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Jatuh Tempo</label><input${ssrRenderAttr("value", unref(createForm).dueDate)} type="date" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" required></div></div><div class="flex gap-2 pt-2"><button type="button" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" })}">Batal</button><button type="submit"${ssrIncludeBooleanAttr(unref(isCreating)) ? " disabled" : ""} class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}">${ssrInterpolate(unref(isCreating) ? "Membuat..." : "Buat")}</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showPayModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="${ssrRenderStyle({ "background": "rgba(15, 15, 15, 0.6)" })}"><div class="bg-white rounded-lg w-full p-5" style="${ssrRenderStyle({ "max-width": "360px", "box-shadow": "rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px" })}"><h2 class="text-lg font-semibold mb-2" style="${ssrRenderStyle({ "color": "#37352F" })}">Catat Pembayaran</h2><p class="text-sm mb-4" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(unref(selectedItem)?.member?.user?.name)} - ${ssrInterpolate(unref(selectedBill)?.name)}</p><form class="space-y-4"><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Nominal</label><input${ssrRenderAttr("value", unref(payForm).amount)} type="number" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" min="1" required></div><div class="flex gap-2"><button type="button" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" })}">Batal</button><button type="submit"${ssrIncludeBooleanAttr(unref(isPaying)) ? " disabled" : ""} class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0F7B6C" })}">${ssrInterpolate(unref(isPaying) ? "Menyimpan..." : "Simpan")}</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kas/[id]/bills.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=bills-CQnP2pIe.mjs.map
