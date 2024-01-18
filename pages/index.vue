<script setup lang="ts">
import JsonEditor from "vue3-ts-jsoneditor";

const { jsonInput } = useJson();
</script>

<template>
  <JsonEditor
    :json="jsonInput"
    :main-menu-bar="false"
    read-only
    mode="tree"
    class="editor w-full h-full"
  >
    <button @click="jsonInput = {}">Clear</button>
  </JsonEditor>
</template>

<style lang="scss">

</style>
