<template>
  <label class="base-toggle">
    <span v-if="label" class="base-toggle__label">{{ label }}</span>
    <span
      class="base-toggle__track"
      :class="{ 'base-toggle__track--on': modelValue }"
      role="switch"
      :aria-checked="modelValue"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span class="base-toggle__thumb" />
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; label?: string }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<style scoped>
.base-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
}

.base-toggle__track {
  width: 38px;
  height: 22px;
  border-radius: 999px;
  background: var(--color-border);
  position: relative;
  transition: background 0.15s ease;
  flex-shrink: 0;
}

.base-toggle__track--on {
  background: var(--color-accent);
}

.base-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.15s ease;
}

.base-toggle__track--on .base-toggle__thumb {
  transform: translateX(16px);
}
</style>
