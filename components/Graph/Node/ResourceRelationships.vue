<script setup lang="ts">
import {Handle, type NodeProps, Position} from '@vue-flow/core'
// import {NodeToolbar} from '@vue-flow/node-toolbar'
import type {Resource} from "~/libraries/jsona";
export type NodeResourceRelationshipsProps = NodeProps<Resource>

defineProps<NodeResourceRelationshipsProps>()
</script>

<template>
<!--  <NodeToolbar :is-visible="data.toolbarVisible" :position="data.toolbarPosition">-->
<!--    <button>delete</button>-->
<!--    <button>copy</button>-->
<!--    <button>expand</button>-->
<!--  </NodeToolbar>-->

  <div class="node">
    <ul>
      <li v-for="(relationship, key) in data.relationshipNames" :key="key">
        <strong>{{ relationship }}</strong>
      </li>
    </ul>

<!--    <div>-->
<!--      <Handle type="source" position="bottom" />-->
<!--    </div>-->
    <Handle type="source" position="right" />
    <Handle type="target" position="left" />
  </div>
</template>

<style scoped lang="scss">
.node {
  @apply bg-amber-200;
}
</style>
