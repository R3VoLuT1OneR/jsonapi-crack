// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path";

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-primevue',
  ],
  primevue: {
    components: {
      prefix: 'P',
      include: [
        'Button',
        'InputText',
      ]
    },
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
    importPT: { as: 'LocalTailwind', from: path.resolve(__dirname, './assets/presets/local.js') },
  }
})
