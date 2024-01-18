<script setup lang="ts">
import {Handle, type NodeProps} from '@vue-flow/core'

export type NodeResourceMetaProps = NodeProps<Record<string, string>>

defineProps<NodeResourceMetaProps>()
</script>

<template>
  <div class="node">
    <span>Meta</span>
    <br>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>

    <div>
      <Handle type="target" position="left" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.node {
  @apply bg-green-50;
}
</style>
