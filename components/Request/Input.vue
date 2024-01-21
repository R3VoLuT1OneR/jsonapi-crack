<script setup lang="ts">

</script>

<template>
  <div>
    <PInputText
      class="mr-2"
      placeholder="https://example.com/jsonapi"
    />
    <PButton
      class="mr-2"
      color="primary"
      size="sm"
    >
      Send
    </PButton>
    <font-awesome-icon
      class="ml-2 cursor-pointer"
      size="lg"
      :icon="['fas', `gear`]"
    />
  </div>
</template>

<style scoped>

</style>
