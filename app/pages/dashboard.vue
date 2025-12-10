<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold" style="color: #37352F;">Dashboard</h1>
      <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">Kelola kas grup Anda</p>
    </div>

    <!-- Action -->
    <div class="mb-6">
      <button @click="showCreateModal = true" class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
        + Buat Kas Baru
      </button>
    </div>

    <!-- Kas List -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 3" :key="i" class="rounded-lg border p-4" style="border-color: rgba(55, 53, 47, 0.09);">
        <div class="h-5 rounded w-40 mb-2 animate-pulse" style="background: rgba(55, 53, 47, 0.08);"></div>
        <div class="h-4 rounded w-24 animate-pulse" style="background: rgba(55, 53, 47, 0.08);"></div>
      </div>
    </div>

    <div v-else-if="!kasList?.length" class="text-center py-16">
      <div class="text-4xl mb-4">💰</div>
      <h3 class="text-lg font-medium mb-2" style="color: #37352F;">Belum ada kas</h3>
      <p class="text-sm mb-6" style="color: rgba(55, 53, 47, 0.65);">Buat kas pertama untuk mulai mengelola keuangan</p>
      <button @click="showCreateModal = true" class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
        Buat Kas Pertama
      </button>
    </div>

    <div v-else class="space-y-2">
      <NuxtLink 
        v-for="kas in kasList" 
        :key="kas.id" 
        :to="`/kas/${kas.id}`"
        class="rounded-lg border p-4 flex items-center justify-between block hover:bg-gray-50 transition"
        style="border-color: rgba(55, 53, 47, 0.09);"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-md flex items-center justify-center text-lg" style="background: rgba(55, 53, 47, 0.03);">💰</div>
          <div>
            <h3 class="font-medium" style="color: #37352F;">{{ kas.name }}</h3>
            <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">{{ kas.memberCount || 0 }} anggota</p>
          </div>
        </div>
        <svg class="w-5 h-5" style="color: rgba(55, 53, 47, 0.4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(15, 15, 15, 0.6);" @click.self="showCreateModal = false">
        <div class="bg-white rounded-lg w-full p-5" style="max-width: 400px; box-shadow: rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;">
          <h2 class="text-lg font-semibold mb-5" style="color: #37352F;">Buat Kas Baru</h2>
          
          <form @submit.prevent="handleCreate" class="space-y-4">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Nama Kas</label>
              <input v-model="createForm.name" type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="Contoh: Kas RT 05" required />
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Deskripsi (Opsional)</label>
              <textarea v-model="createForm.description" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" rows="2" placeholder="Deskripsi singkat"></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Saldo Awal</label>
              <input v-model.number="createForm.initialBalance" type="number" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="0" min="0" />
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { success, error: toastError } = useToast()

const { data: kasResponse, pending, refresh } = await useFetch('/api/kas')
const kasList = computed(() => kasResponse.value?.data || [])

const showCreateModal = ref(false)
const isCreating = ref(false)
const createForm = reactive({
  name: '',
  description: '',
  initialBalance: 0,
})

const handleCreate = async () => {
  isCreating.value = true
  try {
    await $fetch('/api/kas', { method: 'POST', body: createForm })
    success('Kas berhasil dibuat')
    showCreateModal.value = false
    createForm.name = ''
    createForm.description = ''
    createForm.initialBalance = 0
    await refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Gagal membuat kas')
  } finally {
    isCreating.value = false
  }
}
</script>
