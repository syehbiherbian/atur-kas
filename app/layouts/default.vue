<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b" style="border-color: rgba(55, 53, 47, 0.09);">
      <div class="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <span class="text-lg">💰</span>
          <span class="font-medium" style="color: #37352F;">Kas Juwita</span>
        </NuxtLink>

        <!-- User Menu -->
        <div v-if="user" class="relative">
          <button 
            @click="showMenu = !showMenu" 
            class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 transition"
          >
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium" style="background: rgba(55, 53, 47, 0.08); color: #37352F;">
              {{ user.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <span class="text-sm hidden sm:block" style="color: #37352F;">{{ user.name }}</span>
            <svg class="w-4 h-4" style="color: rgba(55, 53, 47, 0.5);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-if="showMenu" 
              class="absolute right-0 mt-1 w-48 bg-white rounded-lg border py-1 shadow-lg"
              style="border-color: rgba(55, 53, 47, 0.09);"
            >
              <div class="px-3 py-2 border-b" style="border-color: rgba(55, 53, 47, 0.09);">
                <p class="text-sm font-medium truncate" style="color: #37352F;">{{ user.name }}</p>
                <p class="text-xs truncate" style="color: rgba(55, 53, 47, 0.65);">{{ user.email || user.phone }}</p>
              </div>
              
              <NuxtLink 
                to="/profile" 
                @click="showMenu = false"
                class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition"
                style="color: #37352F;"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Edit Profile
              </NuxtLink>
              
              <button 
                @click="handleLogout"
                class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition text-left"
                style="color: #E03E3E;"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Keluar
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- Click outside to close menu -->
    <div v-if="showMenu" class="fixed inset-0 z-40" @click="showMenu = false"></div>

    <!-- Main -->
    <main class="max-w-5xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { success } = useToast()
const { user, logout } = useAuth()

const showMenu = ref(false)

const handleLogout = async () => {
  showMenu.value = false
  await logout()
  success('Berhasil keluar')
}
</script>
