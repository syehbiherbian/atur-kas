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

    <!-- Login Form -->
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full" style="max-width: 340px;">
        <h1 class="text-xl font-semibold text-center mb-6" style="color: #37352F;">Masuk ke akun Anda</h1>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div v-if="error" class="p-3 rounded-md text-sm" style="background: rgba(224, 62, 62, 0.08); color: #E03E3E;">
            {{ error }}
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Email atau No. HP</label>
            <input 
              v-model="form.identifier" 
              type="text" 
              class="w-full px-3 py-2 text-sm rounded-md outline-none transition-all"
              style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
              placeholder="you@example.com"
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
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-all"
            :style="{ background: isLoading ? '#6BBDE6' : '#0A85D1', cursor: isLoading ? 'not-allowed' : 'pointer' }"
          >
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm" style="color: rgba(55, 53, 47, 0.65);">
          Belum punya akun? 
          <NuxtLink :to="registerLink" class="hover:underline" style="color: #0A85D1;">Daftar</NuxtLink>
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
const registerLink = computed(() => {
  const redirect = route.query.redirect
  return redirect ? `/register?redirect=${redirect}` : '/register'
})

const form = reactive({
  identifier: '',
  password: '',
})

const isLoading = ref(false)
const error = ref('')

const { login: authLogin } = useAuth()

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await authLogin(form.identifier, form.password)
    success('Berhasil masuk!')
    await navigateTo(redirectPath.value)
  } catch (err: any) {
    error.value = err.message || 'Gagal masuk'
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
