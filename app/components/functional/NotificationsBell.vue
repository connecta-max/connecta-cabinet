<template>
  <div ref="rootEl" class="notifications-bell">
    <button type="button" class="notifications-bell__trigger" :aria-label="t('notifications.title')" @click="open = !open">
      <Bell :size="18" />
      <span v-if="unreadCount > 0" class="notifications-bell__badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>

    <div v-if="open" class="notifications-bell__panel">
      <div class="notifications-bell__header">
        <span class="notifications-bell__title">{{ t('notifications.title') }}</span>
        <button v-if="unreadCount > 0" type="button" class="notifications-bell__mark-all" @click="markAllRead">
          <CheckCheck :size="13" />
          {{ t('notifications.markAllRead') }}
        </button>
      </div>

      <div class="notifications-bell__list">
        <button
          v-for="item in notifications"
          :key="item.id"
          type="button"
          class="notifications-bell__item"
          :class="{ 'notifications-bell__item--unread': !item.read }"
          @click="onSelect(item)"
        >
          <span class="notifications-bell__icon" :class="`notifications-bell__icon--${item.type}`">
            <AlertTriangle v-if="item.type === 'sla_breach'" :size="14" />
            <MessageSquare v-else-if="item.type === 'message'" :size="14" />
            <Banknote v-else-if="item.type === 'penalty'" :size="14" />
            <Ticket v-else :size="14" />
          </span>
          <span class="notifications-bell__body">
            <span class="notifications-bell__text">{{ item.text }}</span>
            <span class="notifications-bell__time">{{ relativeTime(item.createdAt) }}</span>
          </span>
          <span v-if="!item.read" class="notifications-bell__dot" />
        </button>

        <p v-if="notifications.length === 0" class="notifications-bell__empty">{{ t('common.noResults') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle, Banknote, Bell, CheckCheck, MessageSquare, Ticket } from '@lucide/vue'
import type { AppNotification } from '~/composables/useNotifications'

const { t } = useI18n()
const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
useClickOutside(rootEl, () => (open.value = false))

function onSelect(item: AppNotification) {
  markRead(item.id)
  open.value = false
  if (item.link) navigateTo(item.link)
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return t('notifications.justNow')
  if (minutes < 60) return t('notifications.minutesAgo', { n: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('notifications.hoursAgo', { n: hours })
  return t('notifications.daysAgo', { n: Math.floor(hours / 24) })
}
</script>

<style scoped>
.notifications-bell {
  position: relative;
}

.notifications-bell__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
  cursor: pointer;
}

.notifications-bell__trigger:hover {
  color: var(--color-text);
}

.notifications-bell__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  border-radius: 999px;
  background: var(--color-danger);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.notifications-bell__panel {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-width: calc(100vw - 32px);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.notifications-bell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
}

.notifications-bell__title {
  font-size: 13px;
  font-weight: 600;
}

.notifications-bell__mark-all {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  color: var(--color-accent);
  font-size: 11px;
  cursor: pointer;
}

.notifications-bell__list {
  max-height: 360px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.notifications-bell__item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
}

.notifications-bell__item:last-child {
  border-bottom: none;
}

.notifications-bell__item:hover {
  background: var(--color-surface-alt);
}

.notifications-bell__item--unread .notifications-bell__text {
  font-weight: 600;
}

.notifications-bell__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-accent-bg);
  color: var(--color-accent);
}

.notifications-bell__icon--sla_breach {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.notifications-bell__icon--penalty {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.notifications-bell__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.notifications-bell__text {
  font-size: 12px;
  color: var(--color-text);
}

.notifications-bell__time {
  font-size: 11px;
  color: var(--color-text-muted);
}

.notifications-bell__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
  margin-top: 4px;
}

.notifications-bell__empty {
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
