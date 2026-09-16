<template>
  <div v-if="ticket" class="ticket-card">
    <Breadcrumbs :items="breadcrumbItems" />

    <div class="ticket-card__layout">
      <BaseCard class="ticket-card__main">
        <div class="ticket-card__tabs">
          <button
            type="button"
            class="ticket-card__tab"
            :class="{ 'ticket-card__tab--active': activeTab === 'chat' }"
            @click="activeTab = 'chat'"
          >
            {{ t('ticketCard.chatTab') }}
          </button>
          <button
            type="button"
            class="ticket-card__tab"
            :class="{ 'ticket-card__tab--active': activeTab === 'notes' }"
            @click="activeTab = 'notes'"
          >
            {{ t('ticketCard.notesTab') }}
          </button>
        </div>

        <TicketChat v-if="activeTab === 'chat'" :ticket-id="ticket.id" />
        <TicketNotes v-else :ticket-id="ticket.id" />
      </BaseCard>

      <BaseCard :title="`#${ticket.id} · ${client?.fullName}`" class="ticket-card__sidebar">
        <TicketMeta :ticket="ticket" />
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ ticketId: number }>()

const { t } = useI18n()
const { getTicket } = useTickets()
const { getClient } = useClients()

const ticket = computed(() => getTicket(props.ticketId))
const client = computed(() => (ticket.value ? getClient(ticket.value.clientId) : undefined))

const { canViewClients } = usePermissions()

const breadcrumbItems = computed(() => [
  { label: t('nav.tickets'), to: '/tickets' },
  ...(client.value ? [{ label: client.value.fullName, to: canViewClients.value ? `/clients/${client.value.id}` : undefined }] : []),
  { label: `#${props.ticketId}` }
])

const activeTab = ref<'chat' | 'notes'>('chat')
</script>

<style scoped>
.ticket-card__layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  gap: 20px;
  align-items: start;
}

.ticket-card__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.ticket-card__tab {
  border: none;
  background: none;
  padding: 8px 4px;
  margin-right: 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.ticket-card__tab--active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

@media (max-width: 900px) {
  .ticket-card__layout {
    grid-template-columns: 1fr;
  }
}
</style>
