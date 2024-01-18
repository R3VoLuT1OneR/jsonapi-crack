<script setup lang="ts">
import {useJson} from "~/composables/useJson";
import {Collection, deserialize, type Resource} from "~/libraries/jsona";

const { jsonInput } = useJson();

const prepareJsona = (value: any): Collection | Resource | undefined => {
  if (!value) {
    return;
  }

  return deserialize(value);
}

const jsona = ref<Collection | Resource>();

watch (jsonInput, (value) => {
  jsona.value = prepareJsona(value);
}, {
  immediate: true,
})

</script>

<template>
  <GraphMain
    :jsona="jsona"
  />
</template>

<style>
</style>
