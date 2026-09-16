<template>
  <button class="base-button" :class="[`base-button--${variant}`, { 'base-button--sm': size === 'sm' }]" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'md' | 'sm'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false }
)
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s ease, border-color 0.15s ease;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button--sm {
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
}

.base-button--primary {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}

.base-button--primary:not(:disabled):hover {
  opacity: 0.9;
}

.base-button--secondary {
  background: var(--color-surface-alt);
  color: var(--color-text);
  border-color: var(--color-border);
}

.base-button--secondary:not(:disabled):hover {
  border-color: var(--color-accent);
}

.base-button--ghost {
  background: transparent;
  color: var(--color-text-muted);
}

.base-button--ghost:not(:disabled):hover {
  color: var(--color-text);
}

.base-button--danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.base-button--danger:not(:disabled):hover {
  opacity: 0.85;
}
</style>
