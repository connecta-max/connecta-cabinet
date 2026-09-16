<template>
  <div class="ticket-meta">
    <BaseSelect v-model="status" :label="t('ticketCard.status')" :options="statusOptions" @update:model-value="onStatusChange" />

    <div class="ticket-meta__field">
      <span class="ticket-meta__label">{{ t('ticketCard.assignee') }}</span>
      <BaseSelect v-model="assignee" :options="assigneeOptions" @update:model-value="onAssigneeChange" />
      <BaseButton v-if="!ticket.assigneeId" size="sm" variant="secondary" @click="takeTicket">
        {{ t('tickets.takeTicket') }}
      </BaseButton>
    </div>

    <BaseSelect v-model="clientType" :label="t('ticketCard.clientType')" :options="typeOptions" @update:model-value="onTypeChange" />

    <div class="ticket-meta__field">
      <span class="ticket-meta__label">{{ t('ticketCard.tags') }}</span>
      <div class="ticket-meta__tags">
        <BaseTag v-for="tag in ticket.tags" :key="tag" :label="tag" removable @remove="removeTag(ticket.id, tag)" />
      </div>
      <form class="ticket-meta__add-tag" @submit.prevent="onAddTag">
        <BaseInput v-model="newTag" :placeholder="t('ticketCard.addTag')" />
      </form>
    </div>

    <div class="ticket-meta__field">
      <span class="ticket-meta__label">{{ t('ticketCard.csat') }}</span>
      <div v-if="ticket.csat" class="ticket-meta__csat">
        <Star
          v-for="star in 5"
          :key="star"
          :size="16"
          :fill="star <= ticket.csat ? 'currentColor' : 'none'"
          :class="{ 'ticket-meta__star--empty': star > ticket.csat }"
        />
        <span class="ticket-meta__csat-value">({{ ticket.csat }}/5)</span>
      </div>
      <p v-else class="ticket-meta__muted">{{ t('ticketCard.noCsat') }}</p>
    </div>

    <BaseButton v-if="canIssuePenalties" variant="danger" :disabled="!ticket.assigneeId" @click="penaltyModalOpen = true">
      {{ t('ticketCard.issuePenalty') }}
    </BaseButton>

    <PenaltyFormModal v-model="penaltyModalOpen" :employee-id="ticket.assigneeId" :ticket-id="ticket.id" />
  </div>
</template>

<script setup lang="ts">
import { Star } from '@lucide/vue'

import type { ClientType, Ticket } from '~/types'

const props = defineProps<{ ticket: Ticket }>()

const { t } = useI18n()
const { updateStatus, assignEmployee, addTag, removeTag } = useTickets()
const { canIssuePenalties } = usePermissions()
const { employees } = useEmployees()
const { getClient, updateClientType } = useClients()
const { currentEmployeeId } = useAuth()

const status = ref(props.ticket.status)
const assignee = ref(props.ticket.assigneeId ? String(props.ticket.assigneeId) : '')
const clientType = ref(getClient(props.ticket.clientId)?.type ?? 'free')
const newTag = ref('')
const penaltyModalOpen = ref(false)

const statusOptions = computed(() => [
  { value: 'new', label: t('ticketStatus.new') },
  { value: 'in_progress', label: t('ticketStatus.in_progress') },
  { value: 'closed', label: t('ticketStatus.closed') }
])

const assigneeOptions = computed(() => [
  { value: '', label: t('tickets.unassigned') },
  ...employees.value.map((employee) => ({ value: String(employee.id), label: employee.fullName }))
])

const typeOptions = computed(() => [
  { value: 'free', label: t('clientType.free') },
  { value: 'paid', label: t('clientType.paid') },
  { value: 'vip', label: t('clientType.vip') }
])

function onStatusChange(value: string) {
  updateStatus(props.ticket.id, value as Ticket['status'])
}

function onAssigneeChange(value: string) {
  assignEmployee(props.ticket.id, value ? Number(value) : null)
}

function takeTicket() {
  if (currentEmployeeId.value) {
    assignee.value = String(currentEmployeeId.value)
    assignEmployee(props.ticket.id, currentEmployeeId.value)
  }
}

function onTypeChange(value: string) {
  updateClientType(props.ticket.clientId, value as ClientType)
}

function onAddTag() {
  if (!newTag.value.trim()) return
  addTag(props.ticket.id, newTag.value.trim())
  newTag.value = ''
}
</script>

<style scoped>
.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ticket-meta__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ticket-meta__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.ticket-meta__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ticket-meta__csat {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--color-warning);
}

.ticket-meta__star--empty {
  color: var(--color-border);
}

.ticket-meta__csat-value {
  margin-left: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.ticket-meta__muted {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
