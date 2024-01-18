<script setup lang="ts">
const { loadTestJson, loadTestJson2 } = useJson();

</script>

<template>
  <ul class="flex flex-row flex-grow p-2">
    <li class="pl-1 pr-1">
      <button @click="loadTestJson">Test JSON</button>
    </li>
    <li class="pl-1 pr-1">
      <button @click="loadTestJson2">Test JSON 2</button>
    </li>
<!--    <li class="ml-auto">-->
<!--      <nuxt-link to="/about">About</nuxt-link>-->
<!--    </li>-->
  </ul>
</template>

<style scoped>

</style>
