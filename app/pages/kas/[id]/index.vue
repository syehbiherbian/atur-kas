<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/dashboard" class="p-1.5 rounded-md hover:bg-gray-100 transition">
        <svg class="w-5 h-5" style="color: #37352F;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-lg font-semibold" style="color: #37352F;">{{ kas?.name || 'Kas' }}</h1>
        <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">Dashboard</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 border-b" style="border-color: rgba(55, 53, 47, 0.09);">
      <NuxtLink :to="`/kas/${kasId}`" class="px-3 py-2 text-sm font-medium -mb-px" style="color: #37352F; border-bottom: 2px solid #0A85D1;">Dashboard</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/transactions`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Transaksi</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/members`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Anggota</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/bills`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Tagihan</NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div v-for="i in 4" :key="i" class="rounded-lg border p-4" style="border-color: rgba(55, 53, 47, 0.09);">
        <div class="h-4 rounded w-20 mb-2 animate-pulse" style="background: rgba(55, 53, 47, 0.08);"></div>
        <div class="h-6 rounded w-28 animate-pulse" style="background: rgba(55, 53, 47, 0.08);"></div>
      </div>
    </div>

    <template v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="rounded-lg border p-4" style="border-color: rgba(55, 53, 47, 0.09);">
          <p class="text-xs mb-1" style="color: rgba(55, 53, 47, 0.65);">Saldo</p>
          <p class="text-lg font-semibold" style="color: #37352F;">{{ formatCurrency(summary?.currentBalance) }}</p>
        </div>
        <div class="rounded-lg border p-4" style="border-color: rgba(55, 53, 47, 0.09);">
          <p class="text-xs mb-1" style="color: rgba(55, 53, 47, 0.65);">Pemasukan Bulan Ini</p>
          <p class="text-lg font-semibold" style="color: #0F7B6C;">+{{ formatCurrency(summary?.monthIncome) }}</p>
        </div>
        <div class="rounded-lg border p-4" style="border-color: rgba(55, 53, 47, 0.09);">
          <p class="text-xs mb-1" style="color: rgba(55, 53, 47, 0.65);">Pengeluaran Bulan Ini</p>
          <p class="text-lg font-semibold" style="color: #E03E3E;">-{{ formatCurrency(summary?.monthExpense) }}</p>
        </div>
        <div class="rounded-lg border p-4" style="border-color: rgba(55, 53, 47, 0.09);">
          <p class="text-xs mb-1" style="color: rgba(55, 53, 47, 0.65);">{{ summary?.currentMonth }}</p>
          <p class="text-lg font-semibold" :style="{ color: (summary?.monthCashflow || 0) >= 0 ? '#0F7B6C' : '#E03E3E' }">
            {{ (summary?.monthCashflow || 0) >= 0 ? '+' : '' }}{{ formatCurrency(summary?.monthCashflow) }}
          </p>
        </div>
      </div>

      <!-- Chart -->
      <div class="rounded-lg border p-4 mb-6" style="border-color: rgba(55, 53, 47, 0.09);">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium" style="color: #37352F;">Grafik Bulanan {{ chartData?.year }}</h3>
          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded" style="background: #0F7B6C;"></div>
              <span style="color: rgba(55, 53, 47, 0.65);">Pemasukan</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded" style="background: #E03E3E;"></div>
              <span style="color: rgba(55, 53, 47, 0.65);">Pengeluaran</span>
            </div>
          </div>
        </div>
        <div class="h-48">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="rounded-lg border overflow-hidden" style="border-color: rgba(55, 53, 47, 0.09);">
        <div class="px-4 py-3 border-b" style="border-color: rgba(55, 53, 47, 0.09);">
          <h3 class="font-medium" style="color: #37352F;">Transaksi Terbaru</h3>
        </div>
        <div v-if="!recentTransactions?.length" class="p-6 text-center text-sm" style="color: rgba(55, 53, 47, 0.65);">
          Belum ada transaksi
        </div>
        <table v-else class="w-full">
          <thead>
            <tr style="background: rgba(55, 53, 47, 0.03);">
              <th class="px-4 py-2.5 text-left text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Tanggal</th>
              <th class="px-4 py-2.5 text-left text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Deskripsi</th>
              <th class="px-4 py-2.5 text-right text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Nominal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in recentTransactions" :key="tx.id" class="hover:bg-gray-50" style="border-bottom: 1px solid rgba(55, 53, 47, 0.09);">
              <td class="px-4 py-3 text-sm whitespace-nowrap" style="color: rgba(55, 53, 47, 0.65);">{{ formatDateShort(tx.date) }}</td>
              <td class="px-4 py-3 text-sm" style="color: #37352F;">{{ tx.title }}</td>
              <td class="px-4 py-3 text-sm text-right font-medium" :style="{ color: tx.type === 'INCOME' ? '#0F7B6C' : '#E03E3E' }">
                {{ tx.type === 'INCOME' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="recentTransactions?.length" class="px-4 py-3 border-t text-center" style="border-color: rgba(55, 53, 47, 0.09);">
          <NuxtLink :to="`/kas/${kasId}/transactions`" class="text-sm hover:underline" style="color: #0A85D1;">
            Lihat semua →
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { formatCurrency, formatDateShort } from '~/utils/formatters'

Chart.register(...registerables)

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const kasId = computed(() => route.params.id as string)

// Chart canvas ref
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Fetch dashboard data
const { data: dashboardResponse, pending } = await useFetch(() => `/api/kas/${kasId.value}/dashboard`)
const kas = computed(() => dashboardResponse.value?.data?.kas)
const summary = computed(() => dashboardResponse.value?.data?.summary)
const recentTransactions = computed(() => dashboardResponse.value?.data?.recentTransactions || [])

// Fetch chart data
const { data: chartResponse } = await useFetch(() => `/api/kas/${kasId.value}/chart-data`)
const chartData = computed(() => chartResponse.value?.data)

// Create chart when data is loaded
watch([chartCanvas, chartData], ([canvas, data]) => {
  if (canvas && data) {
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy()
    }

    // Create new chart
    chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.chartData.labels,
        datasets: [
          {
            label: 'Pemasukan',
            data: data.chartData.income,
            backgroundColor: 'rgba(15, 123, 108, 0.8)',
            borderRadius: 4,
          },
          {
            label: 'Pengeluaran',
            data: data.chartData.expense,
            backgroundColor: 'rgba(224, 62, 62, 0.8)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y
                return `${context.dataset.label}: ${formatCurrency(value)}`
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value as number),
            },
          },
        },
      },
    })
  }
}, { immediate: true })

// Cleanup chart on unmount
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
