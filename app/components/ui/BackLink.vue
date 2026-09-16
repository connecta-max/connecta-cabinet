<template>
  <NuxtLink :to="to" class="back-link">
    <ArrowLeft :size="15" />
    {{ label }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'

defineProps<{ to: string; label: string }>()
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-accent);
}
</style>
