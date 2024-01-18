<script setup lang="ts">
import JsonEditorVue from "json-editor-vue";
const { jsonInput } = useJson();
</script>

<template>
  <JsonEditorVue
    v-model="jsonInput"
    :main-menu-bar="false"
    mode="text"
  />
</template>

<style scoped>

</style>
