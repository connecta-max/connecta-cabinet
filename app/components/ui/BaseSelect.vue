<template>
  <div class="base-field">
    <span v-if="label" class="base-field__label">{{ label }}</span>
    <div ref="rootEl" class="base-select">
      <button type="button" class="base-select__trigger" @click="toggleOpen">
        <span class="base-select__value">{{ selectedLabel }}</span>
        <ChevronDown :size="16" class="base-select__chevron" :class="{ 'base-select__chevron--open': open }" />
      </button>
      <div v-if="open" class="base-select__panel" :class="{ 'base-select__panel--up': openUp }">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="base-select__option"
          :class="{ 'base-select__option--selected': option.value === modelValue }"
          @click="select(option.value)"
        >
          {{ option.label }}
          <Check v-if="option.value === modelValue" :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, ChevronDown } from '@lucide/vue'

const props = defineProps<{
  modelValue: string
  label?: string
  options: { value: string; label: string }[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)
const openUp = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => props.options.find((option) => option.value === props.modelValue)?.label ?? '')

function toggleOpen() {
  if (open.value) {
    open.value = false
    return
  }
  const rect = rootEl.value?.getBoundingClientRect()
  if (rect) {
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const panelEstimatedHeight = Math.min(260, props.options.length * 38 + 8)
    openUp.value = spaceBelow < panelEstimatedHeight && spaceAbove > spaceBelow
  }
  open.value = true
}

function select(value: string) {
  emit('update:modelValue', value)
  open.value = false
}

useClickOutside(rootEl, () => (open.value = false))
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

.base-select {
  position: relative;
}

.base-select__trigger {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 13px;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
}

.base-select__trigger:focus-visible {
  outline: none;
  border-color: var(--color-accent);
}

.base-select__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-select__chevron {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform 0.15s ease;
}

.base-select__chevron--open {
  transform: rotate(180deg);
}

.base-select__panel {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  min-width: 160px;
}

.base-select__panel--up {
  top: auto;
  bottom: calc(100% + 6px);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 260px;
  overflow-y: auto;
}

.base-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 7px;
  background: none;
  color: var(--color-text-muted);
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.base-select__option:hover {
  background: var(--color-surface-alt);
  color: var(--color-text);
}

.base-select__option--selected {
  background: var(--color-accent-bg);
  color: var(--color-accent);
  font-weight: 500;
}
</style>
