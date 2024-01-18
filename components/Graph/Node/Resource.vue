<script setup lang="ts">
import {Handle, type NodeProps, Position} from '@vue-flow/core'
// import {NodeToolbar} from '@vue-flow/node-toolbar'
import type {Resource} from "~/libraries/jsona";
export type NodeResourceProps = NodeProps<Resource>

defineProps<NodeResourceProps>()
</script>

<template>
<!--  <NodeToolbar :is-visible="data.toolbarVisible" :position="data.toolbarPosition">-->
<!--    <button>delete</button>-->
<!--    <button>copy</button>-->
<!--    <button>expand</button>-->
<!--  </NodeToolbar>-->

  <div class="node">
    <div>
      <span>type:</span>&nbsp;<strong>{{ data._type }}</strong>
    </div>
    <div>
      <span>id:</span>&nbsp;<strong>{{ data.id }}</strong>
    </div>

    <Handle type="source" position="right" />
    <Handle type="target" position="left" />
  </div>
</template>

<style scoped lang="scss">
.node {
  @apply bg-amber-300;
}
</style>
