<template>
  <ClientCard :client-id="clientId" />
</template>

<script setup lang="ts">
const route = useRoute()
const clientId = Number(route.params.id)
</script>
