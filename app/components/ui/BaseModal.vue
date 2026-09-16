<template>
  <Teleport to="body">
    <div v-if="modelValue" class="base-modal">
      <div class="base-modal__backdrop" @click="$emit('update:modelValue', false)" />
      <div class="base-modal__panel">
        <div class="base-modal__header">
          <h2 class="base-modal__title">{{ title }}</h2>
          <button type="button" class="base-modal__close" @click="$emit('update:modelValue', false)">
            <X :size="18" />
          </button>
        </div>
        <div class="base-modal__body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'

defineProps<{ modelValue: boolean; title: string }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<style scoped>
.base-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.base-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.base-modal__panel {
  position: relative;
  width: 420px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.base-modal__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.base-modal__close {
  display: inline-flex;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
}

.base-modal__close:hover {
  color: var(--color-text);
}

.base-modal__body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
