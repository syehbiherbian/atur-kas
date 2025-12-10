<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="border-b" style="border-color: rgba(55, 53, 47, 0.09);">
      <div class="max-w-5xl mx-auto px-4 h-12 flex items-center">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-lg">💰</span>
          <span class="font-medium" style="color: #37352F;">Kas Juwita</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full" style="max-width: 340px;">
        <!-- Loading -->
        <div v-if="pending" class="text-center" style="color: rgba(55, 53, 47, 0.65);">
          Memuat...
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center">
          <div class="text-4xl mb-4">❌</div>
          <h1 class="text-xl font-semibold mb-2" style="color: #37352F;">Undangan Tidak Valid</h1>
          <p class="text-sm mb-6" style="color: rgba(55, 53, 47, 0.65);">{{ error }}</p>
          <NuxtLink to="/" class="inline-block px-4 py-2 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">Kembali</NuxtLink>
        </div>

        <!-- Valid -->
        <div v-else class="text-center">
          <div class="text-4xl mb-4">📨</div>
          <h1 class="text-xl font-semibold mb-2" style="color: #37352F;">Undangan Kas</h1>
          <p class="text-sm mb-6" style="color: rgba(55, 53, 47, 0.65);">
            Anda diundang ke <span class="font-medium" style="color: #37352F;">{{ invitation?.kas?.name }}</span>
          </p>

          <!-- Logged in -->
          <div v-if="isLoggedIn" class="space-y-3">
            <button @click="handleJoin" :disabled="isJoining" class="w-full px-4 py-2 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
              {{ isJoining ? 'Bergabung...' : 'Gabung Sekarang' }}
            </button>
          </div>

          <!-- Not logged in -->
          <div v-else class="space-y-3">
            <NuxtLink :to="`/login?redirect=/join/${token}`" class="block w-full px-4 py-2 text-sm font-medium text-white text-center rounded-md" style="background: #0A85D1;">
              Masuk untuk Bergabung
            </NuxtLink>
            <NuxtLink :to="`/register?redirect=/join/${token}`" class="block w-full px-4 py-2 text-sm font-medium text-center rounded-md" style="background: rgba(55, 53, 47, 0.08); color: #37352F;">
              Daftar Akun Baru
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const { success, error: toastError } = useToast()

const token = computed(() => route.params.token as string)

const { data: authData } = await useFetch('/api/auth/me')
const isLoggedIn = computed(() => !!authData.value?.data)

const { data: inviteResponse, pending, error: fetchError } = await useFetch(() => `/api/join/${token.value}`)
const invitation = computed(() => inviteResponse.value?.data)
const error = computed(() => fetchError.value?.data?.message || (fetchError.value ? 'Undangan tidak valid' : null))

const isJoining = ref(false)

const handleJoin = async () => {
  isJoining.value = true
  try {
    await $fetch(`/api/join/${token.value}`, { method: 'POST' })
    success('Berhasil bergabung!')
    await router.push(`/kas/${invitation.value?.kas?.id}`)
  } catch (err: any) {
    toastError(err.data?.message || 'Gagal bergabung')
  } finally {
    isJoining.value = false
  }
}
</script>
