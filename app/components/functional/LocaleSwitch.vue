<template>
  <div ref="rootEl" class="locale-switch">
    <button type="button" class="locale-switch__trigger" :aria-label="t('header.language')" @click="open = !open">
      {{ locale.toUpperCase() }}
      <ChevronDown :size="14" class="locale-switch__chevron" :class="{ 'locale-switch__chevron--open': open }" />
    </button>
    <div v-if="open" class="locale-switch__panel">
      <button
        v-for="loc in locales"
        :key="loc.code"
        type="button"
        class="locale-switch__option"
        :class="{ 'locale-switch__option--selected': loc.code === locale }"
        @click="select(loc.code)"
      >
        {{ loc.name }}
        <Check v-if="loc.code === locale" :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, ChevronDown } from '@lucide/vue'

const { t, locale, locales, setLocale } = useI18n()

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)

function select(code: string) {
  setLocale(code as 'ru' | 'en')
  open.value = false
}

useClickOutside(rootEl, () => (open.value = false))
</script>

<style scoped>
.locale-switch {
  position: relative;
}

.locale-switch__trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.locale-switch__chevron {
  color: var(--color-text-muted);
  transition: transform 0.15s ease;
}

.locale-switch__chevron--open {
  transform: rotate(180deg);
}

.locale-switch__panel {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  right: 0;
  min-width: 140px;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.locale-switch__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: none;
  border-radius: 7px;
  background: none;
  color: var(--color-text-muted);
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.locale-switch__option:hover {
  background: var(--color-surface-alt);
  color: var(--color-text);
}

.locale-switch__option--selected {
  background: var(--color-accent-bg);
  color: var(--color-accent);
  font-weight: 500;
}
</style>
