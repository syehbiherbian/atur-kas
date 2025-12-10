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
        <h1 class="text-lg font-semibold" style="color: #37352F;">Anggota</h1>
        <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">Kelola anggota kas</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 border-b" style="border-color: rgba(55, 53, 47, 0.09);">
      <NuxtLink :to="`/kas/${kasId}`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Dashboard</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/transactions`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Transaksi</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/members`" class="px-3 py-2 text-sm font-medium -mb-px" style="color: #37352F; border-bottom: 2px solid #0A85D1;">Anggota</NuxtLink>
      <NuxtLink :to="`/kas/${kasId}/bills`" class="px-3 py-2 text-sm font-medium transition" style="color: rgba(55, 53, 47, 0.65);">Tagihan</NuxtLink>
    </div>

    <!-- Actions (OWNER only) -->
    <div v-if="isOwner" class="flex items-center gap-2 mb-6">
      <button @click="showAddModal = true" class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
        + Tambah Anggota
      </button>
      <button @click="generateInvite" :disabled="isGenerating" class="px-3 py-1.5 text-sm font-medium rounded-md" style="background: rgba(55, 53, 47, 0.08); color: #37352F;">
        {{ isGenerating ? 'Membuat...' : '📨 Undang via Link' }}
      </button>
    </div>

    <!-- Members Table -->
    <div class="rounded-lg border overflow-hidden" style="border-color: rgba(55, 53, 47, 0.09);">
      <table class="w-full">
        <thead>
          <tr style="background: rgba(55, 53, 47, 0.03);">
            <th class="px-4 py-2.5 text-left text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Anggota</th>
            <th class="px-4 py-2.5 text-left text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Kontak</th>
            <th class="px-4 py-2.5 text-left text-xs font-medium" style="color: rgba(55, 53, 47, 0.65); border-bottom: 1px solid rgba(55, 53, 47, 0.09);">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="3" class="px-4 py-8 text-center text-sm" style="color: rgba(55, 53, 47, 0.65);">Memuat...</td>
          </tr>
          <tr v-else-if="!members?.length">
            <td colspan="3" class="px-4 py-12 text-center text-sm" style="color: rgba(55, 53, 47, 0.65);">Belum ada anggota</td>
          </tr>
          <tr v-for="member in members" :key="member.id" class="hover:bg-gray-50 transition" style="border-bottom: 1px solid rgba(55, 53, 47, 0.09);">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium" style="background: rgba(55, 53, 47, 0.03); color: #37352F;">
                  {{ member.user?.name?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <span class="font-medium text-sm" style="color: #37352F;">{{ member.user?.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm" style="color: rgba(55, 53, 47, 0.65);">{{ member.user?.phone || member.user?.email || '-' }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 text-xs font-medium rounded" :style="{
                background: member.role === 'OWNER' ? 'rgba(203, 145, 47, 0.1)' : member.role === 'ADMIN' ? 'rgba(10, 133, 209, 0.1)' : 'rgba(55, 53, 47, 0.08)',
                color: member.role === 'OWNER' ? '#CB912F' : member.role === 'ADMIN' ? '#0A85D1' : 'rgba(55, 53, 47, 0.65)'
              }">
                {{ member.role === 'OWNER' ? '👑 Pemilik' : member.role === 'ADMIN' ? '⚡ Admin' : '👤 Member' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Member Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(15, 15, 15, 0.6);" @click.self="showAddModal = false">
        <div class="bg-white rounded-lg w-full p-5" style="max-width: 400px; box-shadow: rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;">
          <h2 class="text-lg font-semibold mb-5" style="color: #37352F;">Tambah Anggota Baru</h2>
          
          <form @submit.prevent="handleAddMember" class="space-y-4">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Nama Lengkap</label>
              <input v-model="addForm.name" type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="Nama anggota" required />
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">No. HP</label>
              <input v-model="addForm.phone" type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="08xxx (opsional jika ada email)" />
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Email</label>
              <input v-model="addForm.email" type="email" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="email@example.com (opsional)" />
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Password Default</label>
              <input v-model="addForm.password" type="text" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" placeholder="Minimal 6 karakter" required />
              <p class="text-xs mt-1" style="color: rgba(55, 53, 47, 0.5);">Password untuk login anggota baru</p>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Role</label>
              <select v-model="addForm.role" class="w-full px-3 py-2 text-sm rounded-md outline-none" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;" required>
                <option value="MEMBER">👤 Member - Hanya bisa melihat</option>
                <option value="ADMIN">⚡ Admin - Bisa mengelola transaksi</option>
              </select>
            </div>

            <div class="flex gap-2 pt-2">
              <button type="button" @click="showAddModal = false" class="flex-1 px-3 py-2 text-sm font-medium rounded-md" style="background: rgba(55, 53, 47, 0.08); color: #37352F;">Batal</button>
              <button type="submit" :disabled="isAdding" class="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
                {{ isAdding ? 'Menambahkan...' : 'Tambah' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Invite Link Modal -->
    <Teleport to="body">
      <div v-if="showInviteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(15, 15, 15, 0.6);" @click.self="showInviteModal = false">
        <div class="bg-white rounded-lg w-full p-5" style="max-width: 400px; box-shadow: rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;">
          <h2 class="text-lg font-semibold mb-4" style="color: #37352F;">📨 Link Undangan</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Link</label>
              <div class="flex gap-2">
                <input :value="inviteData?.inviteLink" readonly class="flex-1 px-3 py-2 text-sm rounded-md" style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F; background: rgba(55, 53, 47, 0.03);" />
                <button @click="copyLink" class="px-3 py-2 rounded-md" style="background: rgba(55, 53, 47, 0.08);">📋</button>
              </div>
            </div>

            <a :href="inviteData?.waShareLink" target="_blank" class="block w-full px-3 py-2 text-sm font-medium text-white text-center rounded-md" style="background: #0F7B6C;">
              Bagikan via WhatsApp
            </a>

            <button @click="showInviteModal = false" class="w-full px-3 py-2 text-sm font-medium rounded-md" style="background: rgba(55, 53, 47, 0.08); color: #37352F;">Tutup</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/formatters'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const kasId = computed(() => route.params.id as string)
const { success, error: toastError } = useToast()

// Fetch kas details
const { data: kasResponse } = await useFetch(() => `/api/kas/${kasId.value}`)
const isOwner = computed(() => kasResponse.value?.data?.currentUserRole === 'OWNER')

// Fetch members
const { data: membersResponse, pending, refresh } = await useFetch(() => `/api/kas/${kasId.value}/members`)
const members = computed(() => membersResponse.value?.data || [])

// Add Member Modal
const showAddModal = ref(false)
const isAdding = ref(false)
const addForm = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
  role: 'MEMBER' as 'ADMIN' | 'MEMBER',
})

const handleAddMember = async () => {
  if (!addForm.phone && !addForm.email) {
    toastError('Harap isi nomor HP atau email')
    return
  }

  isAdding.value = true
  try {
    await $fetch(`/api/kas/${kasId.value}/members`, {
      method: 'POST',
      body: {
        name: addForm.name,
        phone: addForm.phone || null,
        email: addForm.email || null,
        password: addForm.password,
        role: addForm.role,
      },
    })
    success('Anggota berhasil ditambahkan')
    showAddModal.value = false
    addForm.name = ''
    addForm.phone = ''
    addForm.email = ''
    addForm.password = ''
    addForm.role = 'MEMBER'
    await refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Gagal menambahkan anggota')
  } finally {
    isAdding.value = false
  }
}

// Invite Link
const showInviteModal = ref(false)
const isGenerating = ref(false)
const inviteData = ref<any>(null)

const generateInvite = async () => {
  isGenerating.value = true
  try {
    const result = await $fetch(`/api/kas/${kasId.value}/invite`, { method: 'POST' })
    inviteData.value = result.data
    showInviteModal.value = true
  } catch (err: any) {
    toastError(err.data?.message || 'Gagal membuat undangan')
  } finally {
    isGenerating.value = false
  }
}

const copyLink = async () => {
  if (inviteData.value?.inviteLink) {
    await navigator.clipboard.writeText(inviteData.value.inviteLink)
    success('Link berhasil disalin!')
  }
}
</script>
