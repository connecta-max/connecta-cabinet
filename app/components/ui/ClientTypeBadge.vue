<template>
  <span class="client-type-badge" :class="`client-type-badge--${type}`">{{ t(`clientType.${type}`) }}</span>
</template>

<script setup lang="ts">
import type { ClientType } from '~/types'

defineProps<{ type: ClientType }>()
const { t } = useI18n()
</script>

<style scoped>
.client-type-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.client-type-badge--free {
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
}

.client-type-badge--paid {
  background: var(--color-accent-bg);
  color: var(--color-accent);
}

.client-type-badge--vip {
  background: var(--color-vip-bg);
  color: var(--color-vip);
}
</style>
