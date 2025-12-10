<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold" style="color: #37352F;">Edit Profile</h1>
      <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">Kelola informasi akun Anda</p>
    </div>

    <!-- Profile Form -->
    <div class="rounded-lg border p-6" style="max-width: 480px; border-color: rgba(55, 53, 47, 0.09);">
      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div v-if="error" class="p-3 rounded-md text-sm" style="background: rgba(224, 62, 62, 0.08); color: #E03E3E;">
          {{ error }}
        </div>

        <div v-if="successMsg" class="p-3 rounded-md text-sm" style="background: rgba(15, 123, 108, 0.08); color: #0F7B6C;">
          {{ successMsg }}
        </div>

        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Nama Lengkap</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="w-full px-3 py-2 text-sm rounded-md outline-none"
            style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
            required 
          />
        </div>

        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="w-full px-3 py-2 text-sm rounded-md outline-none"
            style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">No. HP</label>
          <input 
            v-model="form.phone" 
            type="text" 
            class="w-full px-3 py-2 text-sm rounded-md outline-none"
            style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
            placeholder="08xxx"
          />
        </div>

        <div class="border-t pt-4 mt-4" style="border-color: rgba(55, 53, 47, 0.09);">
          <h3 class="text-sm font-medium mb-3" style="color: #37352F;">Ganti Password</h3>
          
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Password Lama</label>
              <input 
                v-model="form.currentPassword" 
                type="password" 
                class="w-full px-3 py-2 text-sm rounded-md outline-none"
                style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
                placeholder="Kosongkan jika tidak ingin ganti"
              />
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color: rgba(55, 53, 47, 0.65);">Password Baru</label>
              <input 
                v-model="form.newPassword" 
                type="password" 
                class="w-full px-3 py-2 text-sm rounded-md outline-none"
                style="border: 1px solid rgba(55, 53, 47, 0.16); color: #37352F;"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white rounded-md transition"
            :style="{ background: isLoading ? '#6BBDE6' : '#0A85D1', cursor: isLoading ? 'not-allowed' : 'pointer' }"
          >
            {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, fetchUser } = useAuth()

const form = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
  currentPassword: '',
  newPassword: '',
})

const isLoading = ref(false)
const error = ref('')
const successMsg = ref('')

// Update form when user data loads
watch(user, (newUser) => {
  if (newUser) {
    form.name = newUser.name || ''
    form.email = newUser.email || ''
    form.phone = newUser.phone || ''
  }
}, { immediate: true })

const handleUpdate = async () => {
  isLoading.value = true
  error.value = ''
  successMsg.value = ''

  try {
    await $fetch('/api/auth/profile', {
      method: 'PUT',
      body: {
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        currentPassword: form.currentPassword || null,
        newPassword: form.newPassword || null,
      },
    })
    
    successMsg.value = 'Profile berhasil diperbarui!'
    form.currentPassword = ''
    form.newPassword = ''
    
    // Refresh user data
    await fetchUser()
  } catch (err: any) {
    error.value = err.data?.message || 'Gagal memperbarui profile'
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
</style>
