<template>
  <ClientOnly>
    <div class="theme-toggle" role="tablist" :aria-label="t('header.theme')">
      <button
        type="button"
        class="theme-toggle__option"
        :class="{ 'theme-toggle__option--active': colorMode.value === 'light' }"
        :aria-selected="colorMode.value === 'light'"
        @click="colorMode.preference = 'light'"
      >
        <Sun :size="14" />
      </button>
      <button
        type="button"
        class="theme-toggle__option"
        :class="{ 'theme-toggle__option--active': colorMode.value === 'dark' }"
        :aria-selected="colorMode.value === 'dark'"
        @click="colorMode.preference = 'dark'"
      >
        <Moon :size="14" />
      </button>
    </div>
    <template #fallback>
      <div class="theme-toggle" role="tablist" :aria-label="t('header.theme')">
        <button type="button" class="theme-toggle__option"><Sun :size="14" /></button>
        <button type="button" class="theme-toggle__option theme-toggle__option--active"><Moon :size="14" /></button>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'

const colorMode = useColorMode()
const { t } = useI18n()
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
}

.theme-toggle__option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
}

.theme-toggle__option--active {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}
</style>
