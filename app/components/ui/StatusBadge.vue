<template>
  <span class="status-badge" :class="`status-badge--${status}`">{{ t(`ticketStatus.${status}`) }}</span>
</template>

<script setup lang="ts">
import type { TicketStatus } from '~/types'

defineProps<{ status: TicketStatus }>()
const { t } = useI18n()
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge--new {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.status-badge--in_progress {
  background: var(--color-accent-bg);
  color: var(--color-accent);
}

.status-badge--closed {
  background: var(--color-success-bg);
  color: var(--color-success);
}
</style>
