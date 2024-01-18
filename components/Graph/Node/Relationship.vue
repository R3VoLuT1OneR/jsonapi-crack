<script setup lang="ts">
import {Handle, type NodeProps, Position} from '@vue-flow/core'
// import {NodeToolbar} from '@vue-flow/node-toolbar'
import type {Resource} from "~/libraries/jsona";
import {isCollection as isJsonaCollection} from "~/libraries/jsona";
export type NodeRelationshipProps = NodeProps<Resource>

const props = defineProps<NodeRelationshipProps>()

const isCollection = computed(() => {
  return isJsonaCollection(props.data)
})

const isNull = computed(() => {
  return props.data === null
})

</script>

<template>
<!--  <NodeToolbar :is-visible="data.toolbarVisible" :position="data.toolbarPosition">-->
<!--    <button>delete</button>-->
<!--    <button>copy</button>-->
<!--    <button>expand</button>-->
<!--  </NodeToolbar>-->

  <div class="node" :class="{ 'is-collection': isCollection, 'is-null': isNull }">
    <div v-if="isNull">
      Null
    </div>
    <div v-else-if="isCollection">
      Collection
    </div>
    <div v-else>
      <div>
        <span>type:</span>&nbsp;<strong>{{ data._type }}</strong>
      </div>
      <div>
        <span>id:</span>&nbsp;<strong>{{ data.id }}</strong>
      </div>
    </div>

    <Handle type="target" position="left" />
    <Handle type="source" position="right" />
  </div>
</template>

<style scoped lang="scss">
.node {
  &.is-collection {
    @apply bg-amber-300;
  }
  &.is-null {
    @apply bg-gray-100;
  }
}
</style>
