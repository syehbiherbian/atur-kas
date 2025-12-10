<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b" style="border-color: rgba(55, 53, 47, 0.09);">
      <div class="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">💰</span>
          <span class="font-medium" style="color: #37352F;">Atur Kas</span>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/login" class="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 transition" style="color: #37352F;">Masuk</NuxtLink>
          <NuxtLink to="/register" class="px-3 py-1.5 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">Daftar</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="py-16 md:py-24 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-4 leading-tight" style="color: #37352F;">
          Kelola Kas Bersama dengan Mudah
        </h1>
        <p class="text-lg mb-8" style="color: rgba(55, 53, 47, 0.65);">
          Platform sederhana untuk mengelola keuangan grup, organisasi, atau komunitas. 
          Catat pemasukan, pengeluaran, dan tagihan dalam satu tempat.
        </p>
        <NuxtLink to="/register" class="inline-block px-5 py-2 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
          Mulai Gratis →
        </NuxtLink>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 px-4" style="background: #F7F6F3;">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-xl font-semibold text-center mb-10" style="color: #37352F;">
          Semua yang Anda butuhkan
        </h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white p-5 rounded-lg border" style="border-color: rgba(55, 53, 47, 0.09);">
            <div class="text-2xl mb-3">📊</div>
            <h3 class="font-medium mb-1" style="color: #37352F;">Dashboard</h3>
            <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">
              Lihat saldo, pemasukan dan pengeluaran dalam tampilan yang jelas.
            </p>
          </div>
          <div class="bg-white p-5 rounded-lg border" style="border-color: rgba(55, 53, 47, 0.09);">
            <div class="text-2xl mb-3">💸</div>
            <h3 class="font-medium mb-1" style="color: #37352F;">Transaksi</h3>
            <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">
              Catat setiap transaksi dengan kategori dan deskripsi.
            </p>
          </div>
          <div class="bg-white p-5 rounded-lg border" style="border-color: rgba(55, 53, 47, 0.09);">
            <div class="text-2xl mb-3">👥</div>
            <h3 class="font-medium mb-1" style="color: #37352F;">Anggota</h3>
            <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">
              Kelola anggota dengan mudah. Atur role untuk setiap anggota.
            </p>
          </div>
          <div class="bg-white p-5 rounded-lg border" style="border-color: rgba(55, 53, 47, 0.09);">
            <div class="text-2xl mb-3">📋</div>
            <h3 class="font-medium mb-1" style="color: #37352F;">Tagihan</h3>
            <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">
              Buat tagihan iuran dan lacak pembayaran anggota.
            </p>
          </div>
          <div class="bg-white p-5 rounded-lg border" style="border-color: rgba(55, 53, 47, 0.09);">
            <div class="text-2xl mb-3">📱</div>
            <h3 class="font-medium mb-1" style="color: #37352F;">Mobile Friendly</h3>
            <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">
              Akses dari mana saja dengan tampilan responsif.
            </p>
          </div>
          <div class="bg-white p-5 rounded-lg border" style="border-color: rgba(55, 53, 47, 0.09);">
            <div class="text-2xl mb-3">🔒</div>
            <h3 class="font-medium mb-1" style="color: #37352F;">Aman</h3>
            <p class="text-sm" style="color: rgba(55, 53, 47, 0.65);">
              Data aman dengan kontrol akses berbasis role.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 px-4">
      <div class="max-w-xl mx-auto text-center">
        <h2 class="text-xl font-semibold mb-3" style="color: #37352F;">Siap memulai?</h2>
        <p class="mb-6" style="color: rgba(55, 53, 47, 0.65);">Daftar gratis dan mulai kelola kas Anda.</p>
        <NuxtLink to="/register" class="inline-block px-5 py-2 text-sm font-medium text-white rounded-md" style="background: #0A85D1;">
          Daftar Gratis
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-6 px-4 border-t" style="border-color: rgba(55, 53, 47, 0.09);">
      <div class="max-w-4xl mx-auto text-center text-sm" style="color: rgba(55, 53, 47, 0.65);">
        © 2025 Atur Kas
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>
