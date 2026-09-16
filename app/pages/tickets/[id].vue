<template>
  <TicketCard :ticket-id="ticketId" />
</template>

<script setup lang="ts">
const route = useRoute()
const ticketId = Number(route.params.id)
</script>
