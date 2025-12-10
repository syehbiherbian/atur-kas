import { _ as __nuxt_component_0 } from './nuxt-link-BtHBtImc.mjs';
import { defineComponent, computed, ref, withAsyncContext, watch, withCtx, createBlock, openBlock, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { Chart, registerables } from 'chart.js';
import { a as formatCurrency, b as formatDateShort } from './formatters-C4QdAViG.mjs';
import { a as useRoute } from './server.mjs';
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
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    Chart.register(...registerables);
    const route = useRoute();
    const kasId = computed(() => route.params.id);
    const chartCanvas = ref(null);
    let chartInstance = null;
    const { data: dashboardResponse, pending } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}/dashboard`, "$eeRZxVJPC8")), __temp = await __temp, __restore(), __temp);
    const kas = computed(() => dashboardResponse.value?.data?.kas);
    const summary = computed(() => dashboardResponse.value?.data?.summary);
    const recentTransactions = computed(() => dashboardResponse.value?.data?.recentTransactions || []);
    const { data: chartResponse } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/kas/${kasId.value}/chart-data`, "$XUawREpsaJ")), __temp = await __temp, __restore(), __temp);
    const chartData = computed(() => chartResponse.value?.data);
    watch([chartCanvas, chartData], ([canvas, data]) => {
      if (canvas && data) {
        if (chartInstance) {
          chartInstance.destroy();
        }
        chartInstance = new Chart(canvas, {
          type: "bar",
          data: {
            labels: data.chartData.labels,
            datasets: [
              {
                label: "Pemasukan",
                data: data.chartData.income,
                backgroundColor: "rgba(15, 123, 108, 0.8)",
                borderRadius: 4
              },
              {
                label: "Pengeluaran",
                data: data.chartData.expense,
                backgroundColor: "rgba(224, 62, 62, 0.8)",
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.parsed.y;
                    return `${context.dataset.label}: ${formatCurrency(value)}`;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => formatCurrency(value)
                }
              }
            }
          }
        });
      }
    }, { immediate: true });
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
      _push(`<div><h1 class="text-lg font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(unref(kas)?.name || "Kas")}</h1><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Dashboard</p></div></div><div class="flex gap-1 mb-6 border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/kas/${unref(kasId)}`,
        class: "px-3 py-2 text-sm font-medium -mb-px",
        style: { "color": "#37352F", "border-bottom": "2px solid #0A85D1" }
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
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-3"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="rounded-lg border p-4" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="h-4 rounded w-20 mb-2 animate-pulse" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)" })}"></div><div class="h-6 rounded w-28 animate-pulse" style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.08)" })}"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"><div class="rounded-lg border p-4" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><p class="text-xs mb-1" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Saldo</p><p class="text-lg font-semibold" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(unref(formatCurrency)(unref(summary)?.currentBalance))}</p></div><div class="rounded-lg border p-4" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><p class="text-xs mb-1" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Pemasukan Bulan Ini</p><p class="text-lg font-semibold" style="${ssrRenderStyle({ "color": "#0F7B6C" })}">+${ssrInterpolate(unref(formatCurrency)(unref(summary)?.monthIncome))}</p></div><div class="rounded-lg border p-4" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><p class="text-xs mb-1" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Pengeluaran Bulan Ini</p><p class="text-lg font-semibold" style="${ssrRenderStyle({ "color": "#E03E3E" })}">-${ssrInterpolate(unref(formatCurrency)(unref(summary)?.monthExpense))}</p></div><div class="rounded-lg border p-4" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><p class="text-xs mb-1" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(unref(summary)?.currentMonth)}</p><p class="text-lg font-semibold" style="${ssrRenderStyle({ color: (unref(summary)?.monthCashflow || 0) >= 0 ? "#0F7B6C" : "#E03E3E" })}">${ssrInterpolate((unref(summary)?.monthCashflow || 0) >= 0 ? "+" : "")}${ssrInterpolate(unref(formatCurrency)(unref(summary)?.monthCashflow))}</p></div></div><div class="rounded-lg border p-4 mb-6" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="flex items-center justify-between mb-4"><h3 class="font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}">Grafik Bulanan ${ssrInterpolate(unref(chartData)?.year)}</h3><div class="flex items-center gap-4 text-xs"><div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded" style="${ssrRenderStyle({ "background": "#0F7B6C" })}"></div><span style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Pemasukan</span></div><div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded" style="${ssrRenderStyle({ "background": "#E03E3E" })}"></div><span style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">Pengeluaran</span></div></div></div><div class="h-48"><canvas></canvas></div></div><div class="rounded-lg border overflow-hidden" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><div class="px-4 py-3 border-b" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}"><h3 class="font-medium" style="${ssrRenderStyle({ "color": "#37352F" })}">Transaksi Terbaru</h3></div>`);
        if (!unref(recentTransactions)?.length) {
          _push(`<div class="p-6 text-center text-sm" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}"> Belum ada transaksi </div>`);
        } else {
          _push(`<table class="w-full"><thead><tr style="${ssrRenderStyle({ "background": "rgba(55, 53, 47, 0.03)" })}"><th class="px-4 py-2.5 text-left text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Tanggal</th><th class="px-4 py-2.5 text-left text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Deskripsi</th><th class="px-4 py-2.5 text-right text-xs font-medium" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)", "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}">Nominal</th></tr></thead><tbody><!--[-->`);
          ssrRenderList(unref(recentTransactions), (tx) => {
            _push(`<tr class="hover:bg-gray-50" style="${ssrRenderStyle({ "border-bottom": "1px solid rgba(55, 53, 47, 0.09)" })}"><td class="px-4 py-3 text-sm whitespace-nowrap" style="${ssrRenderStyle({ "color": "rgba(55, 53, 47, 0.65)" })}">${ssrInterpolate(unref(formatDateShort)(tx.date))}</td><td class="px-4 py-3 text-sm" style="${ssrRenderStyle({ "color": "#37352F" })}">${ssrInterpolate(tx.title)}</td><td class="px-4 py-3 text-sm text-right font-medium" style="${ssrRenderStyle({ color: tx.type === "INCOME" ? "#0F7B6C" : "#E03E3E" })}">${ssrInterpolate(tx.type === "INCOME" ? "+" : "-")}${ssrInterpolate(unref(formatCurrency)(tx.amount))}</td></tr>`);
          });
          _push(`<!--]--></tbody></table>`);
        }
        if (unref(recentTransactions)?.length) {
          _push(`<div class="px-4 py-3 border-t text-center" style="${ssrRenderStyle({ "border-color": "rgba(55, 53, 47, 0.09)" })}">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/kas/${unref(kasId)}/transactions`,
            class: "text-sm hover:underline",
            style: { "color": "#0A85D1" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Lihat semua → `);
              } else {
                return [
                  createTextVNode(" Lihat semua → ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kas/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DXttAYpn.mjs.map
