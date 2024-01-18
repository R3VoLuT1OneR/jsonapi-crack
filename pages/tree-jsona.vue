<script setup lang="ts">
import JsonEditor from "vue3-ts-jsoneditor";
import {deserialize, type Resource} from "~/libraries/jsona";

const { jsonInput } = useJson();

const removeRelationshipsNames = (resource: Resource|Resource[]) => {
  if (!resource) {
    return;
  }

  if (Array.isArray(resource)) {
    resource.forEach((item) => {
      removeRelationshipsNames(item)
    })

    return;
  }

  if (Array.isArray(resource.relationshipNames)) {
    resource.relationshipNames.forEach((name) => {
      removeRelationshipsNames(resource[name])
    })
    delete resource['relationshipNames'];
  }
}

const prepareJsona = (value): Resource | undefined => {
  if (!value) {
    return;
  }

  const deserialized = deserialize(value);

  removeRelationshipsNames(deserialized)

  return deserialized;
}

const jsona = ref<Resource>(prepareJsona(jsonInput.value));

watch (jsonInput, (value) => {
  jsona.value = prepareJsona(value);
  console.log('jsona', jsona.value);
})
</script>

<template>
  <JsonEditor
    :json="jsona"
    :main-menu-bar="false"
    read-only
    mode="tree"
    class="w-full h-full"
  />
</template>

<style>
</style>
