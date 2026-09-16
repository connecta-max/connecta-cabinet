<template>
  <div v-if="client" class="client-card">
    <BackLink to="/clients" :label="t('clientCard.backToList')" />

    <div class="client-card__layout">
      <BaseCard :title="t('clientCard.info')">
        <div class="client-card__info">
          <BaseAvatar :name="client.fullName" />
          <div>
            <p class="client-card__name">{{ client.fullName }}</p>
            <p class="client-card__muted">{{ t('clientCard.id') }}: #{{ client.id }}</p>
          </div>
        </div>
        <dl class="client-card__fields">
          <dt>Email</dt>
          <dd>{{ client.email }}</dd>
          <dt>{{ t('clients.columnPhone') }}</dt>
          <dd>{{ client.phone }}</dd>
        </dl>
        <BaseSelect v-model="type" :label="t('clientCard.type')" :options="typeOptions" @update:model-value="onTypeChange" />
      </BaseCard>

      <BaseCard :title="t('clientCard.history')">
        <div class="client-card__history">
          <NuxtLink v-for="ticket in clientTickets" :key="ticket.id" :to="`/tickets/${ticket.id}`" class="client-card__ticket">
            <span>#{{ ticket.id }}</span>
            <StatusBadge :status="ticket.status" />
            <span class="client-card__ticket-date">{{ formatDate(ticket.updatedAt) }}</span>
          </NuxtLink>
          <p v-if="clientTickets.length === 0" class="client-card__muted">{{ t('common.noResults') }}</p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientType } from '~/types'

const props = defineProps<{ clientId: number }>()

const { t, locale } = useI18n()
const { getClient, updateClientType } = useClients()
const { tickets } = useTickets()

const client = computed(() => getClient(props.clientId))
const type = ref(client.value?.type ?? 'free')

const typeOptions = computed(() => [
  { value: 'free', label: t('clientType.free') },
  { value: 'paid', label: t('clientType.paid') },
  { value: 'vip', label: t('clientType.vip') }
])

const clientTickets = computed(() => tickets.value.filter((ticket) => ticket.clientId === props.clientId))

function onTypeChange(value: string) {
  updateClientType(props.clientId, value as ClientType)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value)
}
</script>

<style scoped>
.client-card__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 1fr);
  gap: 20px;
  align-items: start;
}

.client-card__info {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.client-card__name {
  margin: 0;
  font-weight: 600;
}

.client-card__muted {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.client-card__fields {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  font-size: 13px;
  margin: 0 0 16px;
}

.client-card__fields dt {
  color: var(--color-text-muted);
}

.client-card__fields dd {
  margin: 0;
}

.client-card__history {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.client-card__ticket {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.client-card__ticket:hover {
  border-color: var(--color-accent);
}

.client-card__ticket-date {
  margin-left: auto;
  font-size: 12px;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .client-card__layout {
    grid-template-columns: 1fr;
  }
}
</style>
