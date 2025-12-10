import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, computed, withAsyncContext, ref, reactive, withCtx, createBlock, openBlock, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderTeleport, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  __name: "members",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const kasId = computed(() => route.params.id);
    useToast();
    const { data: kasResponse } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}`, "$flZirge1rb")), __temp = await __temp, __restore(), __temp);
    const isOwner = computed(() => kasResponse.value?.data?.currentUserRole === "OWNER");
    const { data: membersResponse, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}/members`, "$nJY0b4dAIG")), __temp = await __temp, __restore(), __temp);
    const members = computed(() => membersResponse.value?.data || []);
    const showAddModal = ref(false);
    const isAdding = ref(false);
    const addForm = reactive({
      name: "",
      phone: "",
      email: "",
      password: "",
      role: "MEMBER"
    });
    const showInviteModal = ref(false);
    const isGenerating = ref(false);
    const inviteData = ref(null);
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
      _push(`<div><h1 class="text-lg font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}">Anggota</h1><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Kelola anggota kas</p></div></div><div class="flex gap-1 mb-6 border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}">`);
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
        class: "px-3 py-2 text-sm font-medium -mb-px",
        style: { "color": "#37352F", "border-bottom": "2px solid #0A85D1" }
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
      if (unref(isOwner)) {
        _push(`<div class="flex items-center gap-2 mb-6"><button class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}"> + Tambah Anggota </button><button${ssrIncludeBooleanAttr(unref(isGenerating)) ? " disabled" : ""} class="px-3 py-1.5 text-sm font-medium rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" })}">${ssrInterpolate(unref(isGenerating) ? "Membuat..." : "📨 Undang via Link")}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-lg border overflow-hidden" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><table class="w-full"><thead><tr style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.03)" })}"><th class="px-4 py-2.5 text-left text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Anggota</th><th class="px-4 py-2.5 text-left text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Kontak</th><th class="px-4 py-2.5 text-left text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Role</th></tr></thead><tbody>`);
      if (unref(pending)) {
        _push(`<tr><td colspan="3" class="px-4 py-8 text-center text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Memuat...</td></tr>`);
      } else if (!unref(members)?.length) {
        _push(`<tr><td colspan="3" class="px-4 py-12 text-center text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Belum ada anggota</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(members), (member) => {
        _push(`<tr class="hover:bg-gray-50 transition" style="${ssrRenderStyle({ "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}"><td class="px-4 py-3"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.03)", "color": "#37352F" })}">${ssrInterpolate(member.user?.name?.charAt(0)?.toUpperCase() || "?")}</div><span class="font-medium text-sm" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(member.user?.name)}</span></div></td><td class="px-4 py-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(member.user?.phone || member.user?.email || "-")}</td><td class="px-4 py-3"><span class="px-2 py-0.5 text-xs font-medium rounded" style="${ssrRenderStyle({
          background: member.role === "OWNER" ? "rgba(203, 145, 47, 0.1)" : member.role === "ADMIN" ? "rgba(10, 133, 209, 0.1)" : "rgba(55, 53, 47, 0.08)",
          color: member.role === "OWNER" ? "#CB912F" : member.role === "ADMIN" ? "#0A85D1" : "rgba(55, 53, 47, 0.65)"
        })}">${ssrInterpolate(member.role === "OWNER" ? "👑 Pemilik" : member.role === "ADMIN" ? "⚡ Admin" : "👤 Member")}</span></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showAddModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="${ssrRenderStyle({ "background": "rgba(15, 15, 15, 0.6)" })}"><div class="bg-white rounded-lg w-full p-5" style="${ssrRenderStyle({ "max-width": "400px", "box-shadow": "rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px" })}"><h2 class="text-lg font-semibold mb-5" style="${ssrRenderStyle({ "color": "#37352F" })}">Tambah Anggota Baru</h2><form class="space-y-4"><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Nama Lengkap</label><input${ssrRenderAttr("value", unref(addForm).name)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Nama anggota" required></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">No. HP</label><input${ssrRenderAttr("value", unref(addForm).phone)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="08xxx (opsional jika ada email)"></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Email</label><input${ssrRenderAttr("value", unref(addForm).email)} type="email" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="email@example.com (opsional)"></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Password Default</label><input${ssrRenderAttr("value", unref(addForm).password)} type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" placeholder="Minimal 6 karakter" required><p class="text-xs mt-1" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.5)" })}">Password untuk login anggota baru</p></div><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Role</label><select class="w-full px-3 py-2 text-sm rounded-md outline-none" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F" })}" required><option value="MEMBER"${ssrIncludeBooleanAttr(Array.isArray(unref(addForm).role) ? ssrLooseContain(unref(addForm).role, "MEMBER") : ssrLooseEqual(unref(addForm).role, "MEMBER")) ? " selected" : ""}>👤 Member - Hanya bisa melihat</option><option value="ADMIN"${ssrIncludeBooleanAttr(Array.isArray(unref(addForm).role) ? ssrLooseContain(unref(addForm).role, "ADMIN") : ssrLooseEqual(unref(addForm).role, "ADMIN")) ? " selected" : ""}>⚡ Admin - Bisa mengelola transaksi</option></select></div><div class="flex gap-2 pt-2"><button type="button" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" })}">Batal</button><button type="submit"${ssrIncludeBooleanAttr(unref(isAdding)) ? " disabled" : ""} class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="${ssrRenderStyle({ "background": "#0A85D1" })}">${ssrInterpolate(unref(isAdding) ? "Menambahkan..." : "Tambah")}</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showInviteModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="${ssrRenderStyle({ "background": "rgba(15, 15, 15, 0.6)" })}"><div class="bg-white rounded-lg w-full p-5" style="${ssrRenderStyle({ "max-width": "400px", "box-shadow": "rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px" })}"><h2 class="text-lg font-semibold mb-4" style="${ssrRenderStyle({ "color": "#37352F" })}">📨 Link Undangan</h2><div class="space-y-4"><div><label class="block text-xs font-medium mb-1.5" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Link</label><div class="flex gap-2"><input${ssrRenderAttr("value", unref(inviteData)?.inviteLink)} readonly class="flex-1 px-3 py-2 text-sm rounded-md" style="${ssrRenderStyle({ "border": "1px solid rgba(55, 53, 47, 0.16)", "color": "#37352F", "background": "rgba(55, 53, 47, 0.03)" })}"><button class="px-3 py-2 rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)" })}">📋</button></div></div><a${ssrRenderAttr("href", unref(inviteData)?.waShareLink)} target="_blank" class="block w-full px-3 py-2 text-sm font-medium text-white text-center rounded-md" style="${ssrRenderStyle({ "background": "#0F7B6C" })}"> Bagikan via WhatsApp </a><button class="w-full px-3 py-2 text-sm font-medium rounded-md" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)", "color": "#37352F" })}">Tutup</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kas/[id]/members.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=members-BGBgVi7M.mjs.map
