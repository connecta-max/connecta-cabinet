<template>
  <div class="base-card">
    <div v-if="title || $slots.actions" class="base-card__header">
      <h2 v-if="title" class="base-card__title">{{ title }}</h2>
      <div v-if="$slots.actions" class="base-card__actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="base-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style scoped>
.base-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
}

.base-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.base-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.base-card__body {
  padding: 20px;
}
</style>
