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

    <!-- Register Form -->
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full" style="max-width: 340px;">
        <h1 class="text-xl font-semibold text-center mb-6" style="color: #37352F;">Buat akun baru</h1>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div v-if="error" class="p-3 rounded-md text-sm" style="background: rgba(224, 62, 62, 0.08); color: #E03E3E;">
            {{ error }}
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Nama Lengkap</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all"
              style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
              placeholder="Nama Anda"
              required 
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Email atau No. HP</label>
            <input 
              v-model="form.identifier" 
              type="text" 
              class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all"
              style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
              placeholder="you@example.com atau 08xxx"
              required 
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all"
              style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
              placeholder="Minimal 6 karakter"
              required 
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Konfirmasi Password</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all"
              style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
              placeholder="Ulangi password"
              required 
            />
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-all"
            :style="{ background: isLoading ? '#6BBDE6' : '#0A85D1', cursor: isLoading ? 'not-allowed' : 'pointer' }"
          >
            {{ isLoading ? 'Memproses...' : 'Daftar' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm" style="color: rgba(55, 53, 47, 0.65);">
          Sudah punya akun? 
          <NuxtLink :to="loginLink" class="hover:underline" style="color: #0A85D1;">Masuk</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const { success, error: toastError } = useToast()

const redirectPath = computed(() => route.query.redirect as string || '/dashboard')
const loginLink = computed(() => {
  const redirect = route.query.redirect
  return redirect ? `/login?redirect=${redirect}` : '/login'
})

const form = reactive({
  name: '',
  identifier: '',
  password: '',
  confirmPassword: '',
})

const isLoading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Password tidak cocok'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.name,
        identifier: form.identifier,
        password: form.password,
      },
    })
    success('Pendaftaran berhasil!')
    await navigateTo(redirectPath.value, { external: true })
  } catch (err: any) {
    error.value = err.data?.message || 'Gagal mendaftar'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
input:focus {
  border-color: #0A85D1 !important;
  box-shadow: 0 0 0 2px rgba(10, 133, 209, 0.15);
}
input::placeholder {
  color: rgba(55, 53, 47, 0.4);
}
</style>
