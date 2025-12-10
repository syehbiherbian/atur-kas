// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    // Server-side only
    databaseUrl: process.env.NUXT_DATABASE_URL || '',
    authSecret: process.env.NUXT_AUTH_SECRET || 'default-secret-change-in-production',
    // WA Gateway (can also be per-kas)
    waGatewayUrl: process.env.NUXT_WA_GATEWAY_URL || '',
    waApiKey: process.env.NUXT_WA_API_KEY || '',
    // Client-side
    public: {
      appName: 'Atur Kas',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },

  app: {
    head: {
      title: 'Atur Kas - Kelola Kas Bersama',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi kelola kas bersama untuk arisan, kos, dan komunitas dengan notifikasi WhatsApp.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  },

  nitro: {
    preset: 'node-server'
  },

  typescript: {
    strict: true
  }
})
