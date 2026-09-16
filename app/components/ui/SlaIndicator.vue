<template>
  <span class="sla-indicator" :class="{ 'sla-indicator--breached': breached }">
    <span class="sla-indicator__dot" />
    {{ breached ? t('tickets.slaBreached') : t('tickets.slaOk') }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ breached: boolean }>()
const { t } = useI18n()
</script>

<style scoped>
.sla-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-success);
}

.sla-indicator--breached {
  color: var(--color-danger);
}

.sla-indicator__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
</style>
