<script setup lang="ts">
import {options} from "~/composables/useDisplayType";

const selected = computed({
  get: () => useRoute().path,
  set: (value) => navigateTo(value)
})

</script>

<template>
  <select v-model="selected" class="bg-blue-100">
    <option v-for="option in options" :value="option.value" >
      {{ option.label }}
    </option>
  </select>

</template>

<style scoped>

</style>
