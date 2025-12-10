import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, computed, withAsyncContext, reactive, ref, withCtx, createBlock, openBlock, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { b as formatDateShort, a as formatCurrency } from './formatters-C4QdAViG.mjs';
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
  __name: "transactions",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const kasId = computed(() => route.params.id);
    useToast();
    const { data: kasResponse } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}`, "$lZZxUDWQt5")), __temp = await __temp, __restore(), __temp);
    const canManage = computed(() => ["OWNER", "ADMIN"].includes(kasResponse.value?.data?.currentUserRole));
    const { data: txResponse, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}/transactions`, "$BRWde7AJdw")), __temp = await __temp, __restore(), __temp);
    const transactions = computed(() => txResponse.value?.data || []);
    const { data: catResponse } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}/categories`, "$HvjjPvgW48")), __temp = await __temp, __restore(), __temp);
    const categories = computed(() => catResponse.value?.data || []);
    const filteredCategories = computed(() => categories.value.filter((c) => c.type === addForm.type));
    const showAddModal = ref(false);
    const isSubmitting = ref(false);
    const addForm = reactive({
      type: "INCOME",
      title: "",
      amount: null,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      categoryId: "",
      description: ""
    });
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
      _push(`<div><h1 class="text-lg font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}">Transaksi</h1><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Kelola pemasukan dan pengeluaran</p></div></div><div class="flex gap-1 mb-6 border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}">`);
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
        class: "px-3 py-2 text-sm font-medium -mb-px",
        style: { "color": "#37352F", "border-bottom": "2px solid #0A85D1" }
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
        class: "px-3 py-2 text-sm font-medium transition",
        style: { "color": "rgba(55, 53, 47, 0.65)" }
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
        _push(`<div class="flex items-center gap-2 mb-6"><button class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0F7B6C" })}">+ Pemasukan</button><button class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#E03E3E" })}">- Pengeluaran</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-lg border overflow-hidden" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><table class="w-full"><thead><tr style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.03)" })}"><th class="px-4 py-2.5 text-left text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Tanggal</th><th class="px-4 py-2.5 text-left text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Deskripsi</th><th class="px-4 py-2.5 text-left text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Kategori</th><th class="px-4 py-2.5 text-right text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Nominal</th>`);
      if (unref(canManage)) {
        _push(`<th class="px-4 py-2.5 w-16" style="${ssrRenderStyle({ "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}"></th>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tr></thead><tbody>`);
      if (unref(pending)) {
        _push(`<tr><td${ssrRenderAttr("colspan", unref(canManage) ? 5 : 4)} class="px-4 py-8 text-center text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Memuat...</td></tr>`);
      } else if (!unref(transactions)?.length) {
        _push(`<tr><td${ssrRenderAttr("colspan", unref(canManage) ? 5 : 4)} class="px-4 py-12 text-center text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Belum ada transaksi</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(transactions), (tx) => {
        _push(`<tr class="hover:bg-gray-50 transition" style="${ssrRenderStyle({ "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}"><td class="px-4 py-3 text-sm whitespace-nowrap" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(unref(formatDateShort)(tx.date))}</td><td class="px-4 py-3"><div class="text-sm font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(tx.title)}</div>`);
        if (tx.description) {
          _push(`<div class="text-xs line-clamp-1" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(tx.description)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="px-4 py-3">`);
        if (tx.category) {
          _push(`<span class="px-2 py-0.5 text-xs font-medium rounded" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(tx.category.name)}</span>`);
        } else {
          _push(`<span class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.4)" })}">-</span>`);
        }
        _push(`</td><td class="px-4 py-3 text-sm text-right font-medium whitespace-nowrap" style="${ssrRenderStyle({ color: tx.type === "INCOME" ? "#0F7B6C" : "#E03E3E" })}">${ssrInterpolate(tx.type === "INCOME" ? "+" : "-")}${ssrInterpolate(unref(formatCurrency)(tx.amount))}</td>`);
        if (unref(canManage)) {
          _push(`<td class="px-4 py-3"><button class="p-1.5 rounded-md hover:bg-red-50 transition" style="${ssrRenderStyle({ "color": "#E03E3E" })}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></td>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showAddModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="${ssrRenderStyle({ "background": "rgba(15, 15, 15, 0.6)" })}"><div class="bg-white rounded-lg w-full p-5" style="${ssrRenderStyle({ "max-width": "400px", "box-shadow": "rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px" })}"><h2 class="text-lg font-semibold mb-5" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(unref(addForm).type === "INCOME" ? "Tambah Pemasukan" : "Tambah Pengeluaran")}</h2><form class="space-y-4"><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Judul</label><input${ssrRenderAttr("value", unref(addForm).title)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Contoh: Iuran Bulanan" required></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Nominal</label><input${ssrRenderAttr("value", unref(addForm).amount)} type="number" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="0" min="1" required></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Tanggal</label><input${ssrRenderAttr("value", unref(addForm).date)} type="date" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" required></div></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Kategori</label><select class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(addForm).categoryId) ? ssrLooseContain(unref(addForm).categoryId, "") : ssrLooseEqual(unref(addForm).categoryId, "")) ? " selected" : ""}>Pilih kategori</option><!--[-->`);
          ssrRenderList(unref(filteredCategories), (cat) => {
            _push2(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(addForm).categoryId) ? ssrLooseContain(unref(addForm).categoryId, cat.id) : ssrLooseEqual(unref(addForm).categoryId, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Catatan</label><textarea class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" rows="2" placeholder="Opsional">${ssrInterpolate(unref(addForm).description)}</textarea></div><div class="flex gap-2 pt-2"><button type="button" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" })}">Batal</button><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}">${ssrInterpolate(unref(isSubmitting) ? "Menyimpan..." : "Simpan")}</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kas/[id]/transactions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=transactions-BeymNCYY.mjs.map
