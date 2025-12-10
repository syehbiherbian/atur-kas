import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}><header class="sticky top-0 z-50 bg-white border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between"><div class="flex items-center gap-2"><span class="text-lg">💰</span><span class="font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}">Atur Kas</span></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 transition",
        style: { "color": "#37352F" }
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
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "px-3 py-1.5 text-sm font-medium text-white rounded-md",
        style: { "background": "#0A85D1" }
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
      _push(`</div></div></header><section class="py-16 md:py-24 px-4"><div class="max-w-2xl mx-auto text-center"><h1 class="text-3xl md:text-4xl font-bold mb-4 leading-tight" style="${ssrRenderStyle({ "color": "#37352F" })}"> Kelola Kas Bersama dengan Mudah </h1><p class="text-lg mb-8" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Platform sederhana untuk mengelola keuangan grup, organisasi, atau komunitas. Catat pemasukan, pengeluaran, dan tagihan dalam satu tempat. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "inline-block px-5 py-2 text-sm font-medium text-white rounded-md",
        style: { "background": "#0A85D1" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Mulai Gratis → `);
          } else {
            return [
              createTextVNode(" Mulai Gratis → ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="py-16 px-4" style="${ssrRenderStyle({ "background": "#F7F6F3" })}"><div class="max-w-4xl mx-auto"><h2 class="text-xl font-semibold text-center mb-10" style="${ssrRenderStyle({ "color": "#37352F" })}"> Semua yang Anda butuhkan </h2><div class="grid md:grid-cols-3 gap-4"><div class="bg-white p-5 rounded-lg border" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="text-2xl mb-3">📊</div><h3 class="font-medium mb-1" style="${ssrRenderStyle({ "color": "#37352F" })}">Dashboard</h3><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Lihat saldo, pemasukan dan pengeluaran dalam tampilan yang jelas. </p></div><div class="bg-white p-5 rounded-lg border" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="text-2xl mb-3">💸</div><h3 class="font-medium mb-1" style="${ssrRenderStyle({ "color": "#37352F" })}">Transaksi</h3><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Catat setiap transaksi dengan kategori dan deskripsi. </p></div><div class="bg-white p-5 rounded-lg border" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="text-2xl mb-3">👥</div><h3 class="font-medium mb-1" style="${ssrRenderStyle({ "color": "#37352F" })}">Anggota</h3><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Kelola anggota dengan mudah. Atur role untuk setiap anggota. </p></div><div class="bg-white p-5 rounded-lg border" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="text-2xl mb-3">📋</div><h3 class="font-medium mb-1" style="${ssrRenderStyle({ "color": "#37352F" })}">Tagihan</h3><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Buat tagihan iuran dan lacak pembayaran anggota. </p></div><div class="bg-white p-5 rounded-lg border" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="text-2xl mb-3">📱</div><h3 class="font-medium mb-1" style="${ssrRenderStyle({ "color": "#37352F" })}">Mobile Friendly</h3><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Akses dari mana saja dengan tampilan responsif. </p></div><div class="bg-white p-5 rounded-lg border" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="text-2xl mb-3">🔒</div><h3 class="font-medium mb-1" style="${ssrRenderStyle({ "color": "#37352F" })}">Aman</h3><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Data aman dengan kontrol akses berbasis role. </p></div></div></div></section><section class="py-16 px-4"><div class="max-w-xl mx-auto text-center"><h2 class="text-xl font-semibold mb-3" style="${ssrRenderStyle({ "color": "#37352F" })}">Siap memulai?</h2><p class="mb-6" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Daftar gratis dan mulai kelola kas Anda.</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "inline-block px-5 py-2 text-sm font-medium text-white rounded-md",
        style: { "background": "#0A85D1" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Daftar Gratis `);
          } else {
            return [
              createTextVNode(" Daftar Gratis ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><footer class="py-6 px-4 border-t" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="max-w-4xl mx-auto text-center text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> © 2025 Atur Kas </div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DkUDlIs0.mjs.map
