<template>
  <span class="base-tag">
    {{ label }}
    <button v-if="removable" type="button" class="base-tag__remove" @click="$emit('remove')">
      <X :size="12" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'

defineProps<{ label: string; removable?: boolean }>()
defineEmits<{ remove: [] }>()
</script>

<style scoped>
.base-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  font-size: 12px;
  color: var(--color-text);
}

.base-tag__remove {
  display: inline-flex;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0;
}

.base-tag__remove:hover {
  color: var(--color-danger);
}
</style>
