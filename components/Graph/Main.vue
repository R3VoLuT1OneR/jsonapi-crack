<script setup lang="ts">
import type { Elements, NodeComponent } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

import {Collection, type Resource, isCollection} from "~/libraries/jsona";
import {buildElementsFromCollection, buildElementsFromResource} from "~/libraries/graphflow";

import GraphNodeResource from './Node/Resource.vue'
import GraphNodeResourceAttributes from './Node/ResourceAttributes.vue'
import GraphNodeResourceRelationships from './Node/ResourceRelationships.vue'
import GraphNodeResourceLinks from './Node/ResourceLinks.vue'
import GraphNodeResourceMeta from './Node/ResourceMeta.vue'
import GraphNodeRelationship from './Node/Relationship.vue'
import {useLayout} from "~/composables/useLayout";

useLayout();

const props = defineProps({
  jsona: {
    type: Object as () => Collection | Resource | undefined,
    required: true,
  },
})

const elements = computed(() => {
  let newElements: Elements = [];

  if (props.jsona) {
    if (isCollection(props.jsona)) {
      newElements = buildElementsFromCollection(props.jsona as Collection);
    } else {
      newElements = buildElementsFromResource(props.jsona as Resource, {})
    }
  }

  return newElements;
})

/* -------------------------------- Node Types -------------------------------- */

const nodeTypes: Record<string, NodeComponent> = {
  'resource': GraphNodeResource,
  'resource-attributes': GraphNodeResourceAttributes,
  'resource-relationships': GraphNodeResourceRelationships,
  'resource-links': GraphNodeResourceLinks,
  'resource-meta': GraphNodeResourceMeta,

  'relationship': GraphNodeRelationship,
}

</script>

<template>
  <VueFlow
    v-model="elements"
    :node-types="nodeTypes"
  >
    <Controls />
    <MiniMap />
<!--      <template #node-links="linksProps">-->
<!--        <NodeLinks v-bind="linksProps" />-->
<!--      </template>-->
<!--      <template #node-resource="resourceProps">-->
<!--        <NodeResource v-bind="resourceProps" />-->
<!--      </template>-->

<!--      &lt;!&ndash; bind your custom node type to a component by using slots, slot names are always `node-<type>` &ndash;&gt;-->
<!--      <template #node-special="specialNodeProps">-->
<!--        <SpecialNode v-bind="specialNodeProps" />-->
<!--      </template>-->

<!--      &lt;!&ndash; bind your custom edge type to a component by using slots, slot names are always `edge-<type>` &ndash;&gt;-->
<!--      <template #edge-special="specialEdgeProps">-->
<!--        <SpecialEdge v-bind="specialEdgeProps" />-->
<!--      </template>-->
  </VueFlow>
</template>

<style>
</style>
