<template>
  <div class="ticket-notes">
    <div class="ticket-notes__list">
      <div v-for="note in notes" :key="note.id" class="ticket-notes__item">
        <div class="ticket-notes__item-header">
          <span class="ticket-notes__author">{{ note.authorName }}</span>
          <span class="ticket-notes__time">{{ formatTime(note.createdAt) }}</span>
        </div>
        <p class="ticket-notes__text">{{ note.text }}</p>
      </div>
      <p v-if="notes.length === 0" class="ticket-notes__empty">{{ t('common.noResults') }}</p>
    </div>

    <form class="ticket-notes__form" @submit.prevent="onAdd">
      <BaseTextarea v-model="draft" :placeholder="t('ticketCard.notePlaceholder')" :rows="2" />
      <BaseButton type="submit" variant="secondary" :disabled="!draft.trim()">{{ t('ticketCard.addNote') }}</BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ ticketId: number }>()

const { t, locale } = useI18n()
const { notesFor, addNote } = useTickets()
const { currentEmployee, currentEmployeeId } = useAuth()

const notes = notesFor(props.ticketId)
const draft = ref('')

function onAdd() {
  if (!draft.value.trim()) return
  addNote(props.ticketId, draft.value.trim(), currentEmployee.value?.fullName ?? t('ticketCard.you'), currentEmployeeId.value)
  draft.value = ''
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(locale.value, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.ticket-notes {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ticket-notes__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ticket-notes__item {
  background: var(--color-warning-bg);
  border-radius: 8px;
  padding: 8px 12px;
}

.ticket-notes__item-header {
  display: flex;
  gap: 8px;
  margin-bottom: 2px;
}

.ticket-notes__author {
  font-size: 12px;
  font-weight: 600;
}

.ticket-notes__time {
  font-size: 11px;
  color: var(--color-text-muted);
}

.ticket-notes__text {
  margin: 0;
  font-size: 13px;
}

.ticket-notes__empty {
  font-size: 13px;
  color: var(--color-text-muted);
}

.ticket-notes__form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
