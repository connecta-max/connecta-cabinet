<template>
  <label class="base-field">
    <span v-if="label" class="base-field__label">{{ label }}</span>
    <textarea
      class="base-field__control"
      :rows="rows"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    rows?: number
  }>(),
  { rows: 3 }
)

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.base-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.base-field__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.base-field__control {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
}

.base-field__control:focus {
  outline: none;
  border-color: var(--color-accent);
}
</style>
