<template>
  <label class="base-checkbox" :class="{ 'base-checkbox--disabled': disabled }">
    <input
      type="checkbox"
      class="base-checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; disabled?: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<style scoped>
.base-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}

.base-checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-checkbox__input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-accent);
}
</style>
