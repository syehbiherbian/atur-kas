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
        <h1 class="text-lg font-semibold" style="color: #37352F;">Transaksi</h1>
        <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">Kelola pemasukan dan pengeluaran</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 border-b" style="border-color: rgba(55, 53, 47, 0.09);">
      <NuxtLink :to="`/kas/${kasId}`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Dashboard</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/transactions`" class="px-3 py-2 text-sm font-medium -mb-px" style="color: #37352F; border-bottom: 2px solid #0A85D1;">Transaksi</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/members`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Anggota</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/bills`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Tagihan</NuxtLink>
    </div>

    <!-- Actions -->
    <div v-if="canManage" class="flex items-center gap-2 mb-6">
      <button @click="openAddModal('INCOME')" class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="background: #0F7B6C;">+ Pemasukan</button>
      <button @click="openAddModal('EXPENSE')" class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="background: #E03E3E;">- Pengeluaran</button>
    </div>

    <!-- Table -->
    <div class="rounded-lg border overflow-hidden" style="border-color: rgba(55, 53, 47, 0.09);">
      <table class="w-full">
        <thead>
          <tr style="background: rgba(55, 53, 47, 0.03);">
            <th class="px-4 py-2.5 text-left text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Tanggal</th>
            <th class="px-4 py-2.5 text-left text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Deskripsi</th>
            <th class="px-4 py-2.5 text-left text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Kategori</th>
            <th class="px-4 py-2.5 text-right text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Nominal</th>
            <th v-if="canManage" class="px-4 py-2.5 w-16" style="border-bottom: 1px solid rgba(55, 53, 47, 0.09);"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td :colspan="canManage ? 5 : 4" class="px-4 py-8 text-center text-sm" style="color: rgba(55, 53, 47, 0.65);">Memuat...</td>
          </tr>
          <tr v-else-if="!transactions?.length">
            <td :colspan="canManage ? 5 : 4" class="px-4 py-12 text-center text-sm" style="color: rgba(55, 53, 47, 0.65);">Belum ada transaksi</td>
          </tr>
          <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50 transition" style="border-bottom: 1px solid rgba(55, 53, 47, 0.09);">
            <td class="px-4 py-3 text-sm whitespace-nowrap" style="color: rgba(55, 53, 47, 0.65);">{{ formatDateShort(tx.date) }}</td>
            <td class="px-4 py-3">
              <div class="text-sm font-medium" style="color: #37352F;">{{ tx.title }}</div>
              <div v-if="tx.description" class="text-xs line-clamp-1" style="color: rgba(55, 53, 47, 0.65);">{{ tx.description }}</div>
            </td>
            <td class="px-4 py-3">
              <span v-if="tx.category" class="px-2 py-0.5 text-xs font-medium rounded" style="background: rgba(55, 53, 47, 0.08); color: rgba(55, 53, 47, 0.65);">{{ tx.category.name }}</span>
              <span v-else class="text-sm" style="color: rgba(55, 53, 47, 0.4);">-</span>
            </td>
            <td class="px-4 py-3 text-sm text-right font-medium whitespace-nowrap" :style="{ color: tx.type === 'INCOME' ? '#0F7B6C' : '#E03E3E' }">
              {{ tx.type === 'INCOME' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
            </td>
            <td v-if="canManage" class="px-4 py-3">
              <button @click="confirmDelete(tx)" class="p-1.5 rounded-md hover:bg-red-50 transition" style="color: #E03E3E;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(15, 15, 15, 0.6);" @click.self="showAddModal = false">
        <div class="bg-white rounded-lg w-full p-5" style="max-width: 400px; box-shadow: rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;">
          <h2 class="text-lg font-semibold mb-5" style="color: #37352F;">
            {{ addForm.type === 'INCOME' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran' }}
          </h2>
          
          <form @submit.prevent="handleAddTransaction" class="space-y-4">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Judul</label>
              <input v-model="addForm.title" type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="Contoh: Iuran Bulanan" required />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Nominal</label>
                <input v-model.number="addForm.amount" type="number" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="0" min="1" required />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Tanggal</label>
                <input v-model="addForm.date" type="date" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" required />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Kategori</label>
              <select v-model="addForm.categoryId" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;">
                <option value="">Pilih kategori</option>
                <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Catatan</label>
              <textarea v-model="addForm.description" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" rows="2" placeholder="Opsional"></textarea>
            </div>

            <div class="flex gap-2 pt-2">
              <button type="button" @click="showAddModal = false" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="background: rgba(55, 53, 47, 0.08); color: #37352F;">Batal</button>
              <button type="submit" :disabled="isSubmitting" class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDateShort } from '~/utils/formatters'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const kasId = computed(() => route.params.id as string)
const { success, error: toastError } = useToast()

// Fetch kas details
const { data: kasResponse } = await useFetch(() => `/api/kas/${kasId.value}`)
const canManage = computed(() => ['OWNER', 'ADMIN'].includes(kasResponse.value?.data?.currentUserRole))

// Fetch transactions
const { data: txResponse, pending, refresh } = await useFetch(() => `/api/kas/${kasId.value}/transactions`)
const transactions = computed(() => txResponse.value?.data || [])

// Fetch categories
const { data: catResponse } = await useFetch(() => `/api/kas/${kasId.value}/categories`)
const categories = computed(() => catResponse.value?.data || [])
const filteredCategories = computed(() => categories.value.filter((c: any) => c.type === addForm.type))

// Add modal
const showAddModal = ref(false)
const isSubmitting = ref(false)
const addForm = reactive({
  type: 'INCOME' as 'INCOME' | 'EXPENSE',
  title: '',
  amount: null as number | null,
  date: new Date().toISOString().split('T')[0],
  categoryId: '',
  description: '',
})

const openAddModal = (type: 'INCOME' | 'EXPENSE') => {
  addForm.type = type
  addForm.title = ''
  addForm.amount = null
  addForm.date = new Date().toISOString().split('T')[0]
  addForm.categoryId = ''
  addForm.description = ''
  showAddModal.value = true
}

const handleAddTransaction = async () => {
  isSubmitting.value = true
  try {
    await $fetch(`/api/kas/${kasId.value}/transactions`, {
      method: 'POST',
      body: { ...addForm, categoryId: addForm.categoryId || null },
    })
    success(addForm.type === 'INCOME' ? 'Pemasukan berhasil ditambahkan' : 'Pengeluaran berhasil ditambahkan')
    showAddModal.value = false
    await refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Gagal menambahkan transaksi')
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (tx: any) => {
  if (!confirm(`Hapus transaksi "${tx.title}"?`)) return
  try {
    await $fetch(`/api/kas/${kasId.value}/transactions?id=${tx.id}`, { method: 'DELETE' })
    success('Transaksi berhasil dihapus')
    await refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Gagal menghapus transaksi')
  }
}
</script>
