<template>
  <BaseCard :title="t('clients.title')">
    <BaseTable
      :columns="columns"
      :rows="clients"
      :row-key="(row) => row.id"
      row-clickable
      :page-size="10"
      @row-click="(row) => navigateTo(`/clients/${row.id}`)"
    >
      <template #cell-name="{ row }">
        <span class="clients-list__name">
          <BaseAvatar :name="row.fullName" size="sm" />
          {{ row.fullName }}
        </span>
      </template>
      <template #cell-email="{ row }">{{ row.email }}</template>
      <template #cell-phone="{ row }">{{ row.phone }}</template>
      <template #cell-type="{ row }"><ClientTypeBadge :type="row.type" /></template>
      <template #cell-tickets="{ row }">{{ ticketsCount(row.id) }}</template>
    </BaseTable>
  </BaseCard>
</template>

<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/BaseTable.vue'

const { t } = useI18n()
const { clients } = useClients()
const { tickets } = useTickets()

function ticketsCount(clientId: number) {
  return tickets.value.filter((ticket) => ticket.clientId === clientId).length
}

const columns: DataTableColumn[] = [
  { key: 'name', label: t('clients.columnName'), width: 190, sortable: true, pinnable: true, sortAccessor: (row) => row.fullName },
  { key: 'email', label: t('clients.columnEmail'), width: 210 },
  { key: 'phone', label: t('clients.columnPhone'), width: 170 },
  { key: 'type', label: t('clients.columnType'), width: 110, sortable: true, pinnable: true, sortAccessor: (row) => row.type },
  { key: 'tickets', label: t('clients.columnTickets'), width: 120, sortable: true, sortAccessor: (row) => ticketsCount(row.id) }
]
</script>

<style scoped>
.clients-list__name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}
</style>
