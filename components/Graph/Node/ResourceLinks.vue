<script setup lang="ts">
import {Handle, type NodeProps} from '@vue-flow/core'

export type NodeResourceLinksProps = NodeProps<Record<string, string>>

defineProps<NodeResourceLinksProps>()
</script>

<template>
  <div class="node">
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>

    <Handle type="target" position="left" />
  </div>
</template>

<style scoped lang="scss">
.node {
  @apply bg-blue-100;
}
</style>
