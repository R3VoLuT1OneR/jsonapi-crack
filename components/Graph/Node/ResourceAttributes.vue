<script setup lang="ts">
import {Handle, type NodeProps, Position} from '@vue-flow/core'
// import {NodeToolbar} from '@vue-flow/node-toolbar'
import {resourceAttributesKeys, type Resource} from "~/libraries/jsona";
export type NodeResourceAttributesProps = NodeProps<Resource & Record<string, unknown>>

const props = defineProps<NodeResourceAttributesProps>()

const attributes = computed(() => {
  return resourceAttributesKeys(props.data)
    .reduce((acc, curr) => {
      acc[curr] = props.data[curr]
      return acc
    }, {} as Record<string, unknown>)
})
</script>

<template>
<!--  <NodeToolbar :is-visible="data.toolbarVisible" :position="data.toolbarPosition">-->
<!--    <button>delete</button>-->
<!--    <button>copy</button>-->
<!--    <button>expand</button>-->
<!--  </NodeToolbar>-->

  <div class="node">
    <pre>{{ JSON.stringify(attributes, null, 2) }}</pre>

    <Handle type="target" position="left" />
  </div>
</template>

<style scoped lang="scss">
.node {
  @apply bg-amber-100;
}
</style>
