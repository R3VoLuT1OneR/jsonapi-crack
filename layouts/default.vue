<script setup lang="ts">
import {useSidebar} from "~/composables/useSidebar";

const { sidebar, toggleSidebar } = useSidebar();

</script>

<template>
  <div class="h-screen flex flex-col">
    <header class="flex flex-row bg-blue-100">
      <h1 class="p-2 font-bold">
        <nuxt-link to="/">JSON:API Crack</nuxt-link>
      </h1>
      <LayoutSelector />
      <LayoutMenu />
    </header>
    <div class="flex flex-grow overflow-hidden">
      <div class="overflow-auto transition-width ease-in-out duration-300 transform" :class="{ 'w-1/3': sidebar, 'w-0': !sidebar }">
        <LayoutJsonInput class="w-full h-full" />
      </div>
      <div class="overflow-auto relative" :class="{ 'w-2/3': sidebar, 'w-full': !sidebar }">
        <font-awesome-icon
          class="absolute top-1 left-1 w-8 h-8 cursor-pointer z-10"
          :class="{
            'text-gray-500': sidebar,
            'text-gray-800': !sidebar,
          }"
          size="xl"
          :icon="['fas', `square-caret-${sidebar ? 'left' : 'right'}`]"
          @click="toggleSidebar"
        />
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
</style>
