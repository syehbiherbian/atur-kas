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
        <h1 class="text-lg font-semibold" style="color: #37352F;">Tagihan</h1>
        <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">Kelola iuran anggota</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 border-b" style="border-color: rgba(55, 53, 47, 0.09);">
      <NuxtLink :to="`/kas/${kasId}`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Dashboard</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/transactions`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Transaksi</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/members`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Anggota</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/bills`" class="px-3 py-2 text-sm font-medium -mb-px" style="color: #37352F; border-bottom: 2px solid #0A85D1;">Tagihan</NuxtLink>
    </div>

    <!-- Actions -->
    <div v-if="canManage" class="mb-6">
      <button @click="showCreateModal = true" class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
        + Buat Tagihan
      </button>
    </div>

    <!-- Bills List -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 2" :key="i" class="rounded-lg border p-4" style="border-color: rgba(55, 53, 47, 0.09);">
        <div class="h-5 rounded w-40 mb-2 animate-pulse" style="background: rgba(55, 53, 47, 0.08);"></div>
        <div class="h-4 rounded w-28 animate-pulse" style="background: rgba(55, 53, 47, 0.08);"></div>
      </div>
    </div>

    <div v-else-if="!bills?.length" class="text-center py-16 text-sm" style="color: rgba(55, 53, 47, 0.65);">
      Belum ada tagihan
    </div>

    <div v-else class="space-y-4">
      <div v-for="bill in bills" :key="bill.id" class="rounded-lg border p-5" style="border-color: rgba(55, 53, 47, 0.09);">
        <!-- Bill Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-semibold" style="color: #37352F;">{{ bill.name }}</h3>
            <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">📅 Jatuh tempo: {{ formatDate(bill.dueDate) }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold" style="color: #37352F;">{{ formatCurrency(bill.amountDefault) }}</p>
            <p class="text-xs" style="color: rgba(55, 53, 47, 0.65);">per anggota</p>
          </div>
        </div>

        <!-- Progress -->
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-1.5">
            <span style="color: rgba(55, 53, 47, 0.65);">Terkumpul: {{ formatCurrency(bill.stats.paidAmount) }}</span>
            <span class="font-medium" :style="{ color: bill.stats.percentage >= 100 ? '#0F7B6C' : '#37352F' }">{{ bill.stats.percentage }}%</span>
          </div>
          <div class="w-full h-1 rounded-full overflow-hidden" style="background: rgba(55, 53, 47, 0.08);">
            <div class="h-full rounded-full transition-all" :style="{ width: `${Math.min(bill.stats.percentage, 100)}%`, background: bill.stats.percentage >= 100 ? '#0F7B6C' : '#0A85D1' }"></div>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex gap-2 text-xs mb-4 pb-4 border-b" style="border-color: rgba(55, 53, 47, 0.09);">
          <span class="px-2 py-1 rounded" style="background: rgba(15, 123, 108, 0.1); color: #0F7B6C;">✓ {{ bill.stats.paidCount }} Lunas</span>
          <span class="px-2 py-1 rounded" style="background: rgba(203, 145, 47, 0.1); color: #CB912F;">⏳ {{ bill.stats.partialCount }} Sebagian</span>
          <span class="px-2 py-1 rounded" style="background: rgba(224, 62, 62, 0.1); color: #E03E3E;">✗ {{ bill.stats.unpaidCount }} Belum</span>
        </div>

        <!-- Bill Items -->
        <div class="space-y-2">
          <div v-for="item in bill.items" :key="item.id" class="flex items-center justify-between p-3 rounded-md" style="background: rgba(55, 53, 47, 0.03);">
            <div class="flex items-center gap-3">
              <div class="w-7 h-7 rounded flex items-center justify-center text-xs font-medium" style="background: #fff; color: #37352F;">
                {{ item.member?.user?.name?.charAt(0)?.toUpperCase() || '?' }}
              </div>
              <div>
                <p class="text-sm font-medium" style="color: #37352F;">{{ item.member?.user?.name }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 text-xs font-medium rounded" :style="{
                background: item.status === 'PAID' ? 'rgba(15, 123, 108, 0.1)' : item.status === 'PARTIAL' ? 'rgba(203, 145, 47, 0.1)' : 'rgba(224, 62, 62, 0.1)',
                color: item.status === 'PAID' ? '#0F7B6C' : item.status === 'PARTIAL' ? '#CB912F' : '#E03E3E'
              }">
                {{ item.status === 'PAID' ? 'Lunas' : item.status === 'PARTIAL' ? 'Sebagian' : 'Belum' }}
              </span>
              <button v-if="item.status !== 'PAID' && canManage" @click="openPayModal(bill, item)" class="px-2 py-1 text-xs font-medium text-white rounded" style="background: #0F7B6C;">
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Bill Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(15, 15, 15, 0.6);" @click.self="showCreateModal = false">
        <div class="bg-white rounded-lg w-full p-5" style="max-width: 400px; box-shadow: rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;">
          <h2 class="text-lg font-semibold mb-5" style="color: #37352F;">Buat Tagihan Baru</h2>
          
          <form @submit.prevent="handleCreateBill" class="space-y-4">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Nama Tagihan</label>
              <input v-model="createForm.name" type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="Contoh: Iuran Januari" required />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Nominal</label>
                <input v-model.number="createForm.amountDefault" type="number" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" min="1" required />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Jatuh Tempo</label>
                <input v-model="createForm.dueDate" type="date" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" required />
              </div>
            </div>
            <div class="flex gap-2 pt-2">
              <button type="button" @click="showCreateModal = false" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="background: rgba(55, 53, 47, 0.08); color: #37352F;">Batal</button>
              <button type="submit" :disabled="isCreating" class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
                {{ isCreating ? 'Membuat...' : 'Buat' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Pay Modal -->
    <Teleport to="body">
      <div v-if="showPayModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(15, 15, 15, 0.6);" @click.self="showPayModal = false">
        <div class="bg-white rounded-lg w-full p-5" style="max-width: 360px; box-shadow: rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;">
          <h2 class="text-lg font-semibold mb-2" style="color: #37352F;">Catat Pembayaran</h2>
          <p class="text-sm mb-4" style="color: rgba(55, 53, 47, 0.65);">{{ selectedItem?.member?.user?.name }} - {{ selectedBill?.name }}</p>
          <form @submit.prevent="handlePay" class="space-y-4">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Nominal</label>
              <input v-model.number="payForm.amount" type="number" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" min="1" required />
            </div>
            <div class="flex gap-2">
              <button type="button" @click="showPayModal = false" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="background: rgba(55, 53, 47, 0.08); color: #37352F;">Batal</button>
              <button type="submit" :disabled="isPaying" class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="background: #0F7B6C;">
                {{ isPaying ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '~/utils/formatters'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const kasId = computed(() => route.params.id as string)
const { success, error: toastError } = useToast()

// Fetch kas details
const { data: kasResponse } = await useFetch(() => `/api/kas/${kasId.value}`)
const canManage = computed(() => ['OWNER', 'ADMIN'].includes(kasResponse.value?.data?.currentUserRole))

// Fetch bills
const { data: billsResponse, pending, refresh } = await useFetch(() => `/api/kas/${kasId.value}/bills`)
const bills = computed(() => billsResponse.value?.data || [])

// Create modal
const showCreateModal = ref(false)
const isCreating = ref(false)
const createForm = reactive({
  name: '',
  amountDefault: null as number | null,
  dueDate: '',
})

const handleCreateBill = async () => {
  isCreating.value = true
  try {
    await $fetch(`/api/kas/${kasId.value}/bills`, { method: 'POST', body: createForm })
    success('Tagihan berhasil dibuat')
    showCreateModal.value = false
    createForm.name = ''
    createForm.amountDefault = null
    createForm.dueDate = ''
    await refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Gagal membuat tagihan')
  } finally {
    isCreating.value = false
  }
}

// Pay modal
const showPayModal = ref(false)
const isPaying = ref(false)
const selectedBill = ref<any>(null)
const selectedItem = ref<any>(null)
const payForm = reactive({ amount: 0 })

const openPayModal = (bill: any, item: any) => {
  selectedBill.value = bill
  selectedItem.value = item
  payForm.amount = parseFloat(item.amount) - parseFloat(item.paidAmount)
  showPayModal.value = true
}

const handlePay = async () => {
  isPaying.value = true
  try {
    await $fetch(`/api/kas/${kasId.value}/bills/${selectedBill.value.id}/pay`, {
      method: 'POST',
      body: { billItemId: selectedItem.value.id, amount: payForm.amount },
    })
    success('Pembayaran berhasil dicatat')
    showPayModal.value = false
    await refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Gagal mencatat pembayaran')
  } finally {
    isPaying.value = false
  }
}
</script>
