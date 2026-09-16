<template>
  <nav class="breadcrumbs">
    <ArrowLeft :size="15" class="breadcrumbs__icon" />
    <template v-for="(item, index) in items" :key="index">
      <NuxtLink v-if="item.to" :to="item.to" class="breadcrumbs__link">{{ item.label }}</NuxtLink>
      <span v-else class="breadcrumbs__current">{{ item.label }}</span>
      <ChevronRight v-if="index < items.length - 1" :size="14" class="breadcrumbs__sep" />
    </template>
  </nav>
</template>

<script setup lang="ts">
import { ArrowLeft, ChevronRight } from '@lucide/vue'

defineProps<{ items: { label: string; to?: string }[] }>()
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--color-text-muted);
  flex-wrap: wrap;
}

.breadcrumbs__icon {
  flex-shrink: 0;
  margin-right: 2px;
}

.breadcrumbs__link {
  color: var(--color-text-muted);
  text-decoration: none;
}

.breadcrumbs__link:hover {
  color: var(--color-accent);
}

.breadcrumbs__current {
  color: var(--color-text);
  font-weight: 500;
}

.breadcrumbs__sep {
  flex-shrink: 0;
  opacity: 0.5;
}
</style>
