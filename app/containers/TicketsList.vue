<template>
  <BaseCard :title="t('tickets.title')">
    <div class="tickets-list__filters">
      <BaseSelect v-model="statusFilter" :label="t('tickets.filterStatus')" :options="statusOptions" />
      <BaseSelect v-model="assigneeFilter" :label="t('tickets.filterAssignee')" :options="assigneeOptions" />
      <BaseSelect v-model="typeFilter" :label="t('tickets.filterType')" :options="typeOptions" />
      <BaseSelect v-model="tagFilter" :label="t('tickets.filterTag')" :options="tagOptions" />
    </div>

    <BaseTable
      :columns="columns"
      :rows="filteredTickets"
      :row-key="(row) => row.id"
      :row-class="rowClass"
      row-clickable
      :page-size="10"
      @row-click="(row) => navigateTo(`/tickets/${row.id}`)"
    >
      <template #cell-id="{ row }">#{{ row.id }}</template>
      <template #cell-client="{ row }">{{ getClient(row.clientId)?.fullName }}</template>
      <template #cell-status="{ row }"><StatusBadge :status="row.status" /></template>
      <template #cell-type="{ row }"><ClientTypeBadge :type="clientTypeOf(row)" /></template>
      <template #cell-assignee="{ row }">{{ row.assigneeId ? getEmployee(row.assigneeId)?.fullName : t('tickets.unassigned') }}</template>
      <template #cell-tags="{ row }">
        <div class="tickets-list__tags">
          <BaseTag v-for="tag in row.tags" :key="tag" :label="tag" />
        </div>
      </template>
      <template #cell-updated="{ row }">{{ formatDate(row.updatedAt) }}</template>
      <template #cell-sla="{ row }"><SlaIndicator :breached="isSlaBreached(row)" /></template>
    </BaseTable>
  </BaseCard>
</template>

<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/BaseTable.vue'

const { t, locale } = useI18n()
const { sortedTickets, clientTypeOf, isSlaBreached } = useTickets()
const { getClient } = useClients()
const { employees, getEmployee } = useEmployees()

const statusFilter = ref('all')
const assigneeFilter = ref('all')
const typeFilter = ref('all')
const tagFilter = ref('all')

const statusOptions = computed(() => [
  { value: 'all', label: t('common.all') },
  { value: 'new', label: t('ticketStatus.new') },
  { value: 'in_progress', label: t('ticketStatus.in_progress') },
  { value: 'closed', label: t('ticketStatus.closed') }
])

const assigneeOptions = computed(() => [
  { value: 'all', label: t('common.all') },
  { value: 'unassigned', label: t('tickets.unassigned') },
  ...employees.value.map((employee) => ({ value: String(employee.id), label: employee.fullName }))
])

const typeOptions = computed(() => [
  { value: 'all', label: t('common.all') },
  { value: 'free', label: t('clientType.free') },
  { value: 'paid', label: t('clientType.paid') },
  { value: 'vip', label: t('clientType.vip') }
])

const allTags = computed(() => Array.from(new Set(sortedTickets.value.flatMap((ticket) => ticket.tags))))

const tagOptions = computed(() => [{ value: 'all', label: t('common.all') }, ...allTags.value.map((tag) => ({ value: tag, label: tag }))])

const filteredTickets = computed(() =>
  sortedTickets.value.filter((ticket) => {
    if (statusFilter.value !== 'all' && ticket.status !== statusFilter.value) return false
    if (assigneeFilter.value === 'unassigned' && ticket.assigneeId !== null) return false
    if (assigneeFilter.value !== 'all' && assigneeFilter.value !== 'unassigned' && ticket.assigneeId !== Number(assigneeFilter.value)) return false
    if (typeFilter.value !== 'all' && clientTypeOf(ticket) !== typeFilter.value) return false
    if (tagFilter.value !== 'all' && !ticket.tags.includes(tagFilter.value)) return false
    return true
  })
)

function rowClass(row: any) {
  return { 'tickets-list__row--vip': clientTypeOf(row) === 'vip' }
}

const columns: DataTableColumn[] = [
  { key: 'id', label: t('tickets.columnId'), width: 64 },
  { key: 'client', label: t('tickets.columnClient'), width: 160, sortable: true, pinnable: true, sortAccessor: (row) => getClient(row.clientId)?.fullName ?? '' },
  { key: 'status', label: t('tickets.columnStatus'), width: 120, sortable: true, pinnable: true, sortAccessor: (row) => row.status },
  { key: 'type', label: t('tickets.columnType'), width: 110, sortable: true, sortAccessor: (row) => clientTypeOf(row) },
  { key: 'assignee', label: t('tickets.columnAssignee'), width: 160, sortable: true, sortAccessor: (row) => (row.assigneeId ? getEmployee(row.assigneeId)?.fullName ?? '' : '') },
  { key: 'tags', label: t('tickets.columnTags'), width: 180 },
  { key: 'updated', label: t('tickets.columnUpdated'), width: 140, sortable: true, sortAccessor: (row) => new Date(row.updatedAt).getTime() },
  { key: 'sla', label: t('tickets.columnSla'), width: 110, sortable: true, sortAccessor: (row) => (isSlaBreached(row) ? 1 : 0) }
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(locale.value, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.tickets-list__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.tickets-list__filters > * {
  min-width: 160px;
  flex: 1 1 160px;
}

.tickets-list__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/*
 * The VIP indicator is an independent pseudo-element on the row's first cell, not a
 * box-shadow (a pinned column already uses box-shadow for its frozen-edge divider,
 * and sharing that property would make one silently overwrite the other depending on
 * pin state) and not a pseudo-element on the <tr> itself (browsers give generated
 * content on table-rows special anonymous-box handling, which was inserting a phantom
 * column and misaligning every header from the header row onward).
 */
:deep(.tickets-list__row--vip > .data-table__td:first-child) {
  position: relative;
}

:deep(.tickets-list__row--vip > .data-table__td:first-child)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-vip);
  z-index: 3;
  pointer-events: none;
}
</style>
