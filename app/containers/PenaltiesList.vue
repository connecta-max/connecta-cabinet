<template>
  <BaseCard :title="isAdmin ? t('penalties.title') : t('penalties.myTitle')">
    <div class="penalties-list__filters">
      <BaseSelect v-if="isAdmin" v-model="employeeFilter" :label="t('penalties.filterEmployee')" :options="employeeOptions" />
      <BaseSelect v-model="periodFilter" :label="t('penalties.filterPeriod')" :options="periodOptions" />
    </div>

    <BaseTable :columns="columns" :rows="filteredPenalties" :row-key="(row) => row.id" :page-size="10">
      <template #cell-date="{ row }">{{ formatDate(row.createdAt) }}</template>
      <template #cell-employee="{ row }">{{ getEmployee(row.employeeId)?.fullName }}</template>
      <template #cell-amount="{ row }"><span class="penalties-list__amount">−{{ row.amount }} ₽</span></template>
      <template #cell-reason="{ row }">{{ row.reason }}</template>
      <template #cell-issuedBy="{ row }">{{ row.issuedBy === 'system' ? t('penalties.automatic') : row.issuedBy }}</template>
      <template #cell-ticket="{ row }">
        <NuxtLink v-if="row.ticketId" :to="`/tickets/${row.ticketId}`">#{{ row.ticketId }}</NuxtLink>
        <span v-else>—</span>
      </template>
    </BaseTable>
  </BaseCard>
</template>

<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/BaseTable.vue'

const { t, locale } = useI18n()
const { penalties } = usePenalties()
const { employees, getEmployee } = useEmployees()
const { isAdmin } = usePermissions()
const { currentEmployeeId } = useAuth()

const employeeFilter = ref('all')
const periodFilter = ref('all')

const employeeOptions = computed(() => [
  { value: 'all', label: t('common.all') },
  ...employees.value.map((employee) => ({ value: String(employee.id), label: employee.fullName }))
])

const periodOptions = computed(() => [
  { value: 'all', label: t('penalties.periodAll') },
  { value: 'week', label: t('penalties.periodWeek') },
  { value: 'month', label: t('penalties.periodMonth') }
])

const filteredPenalties = computed(() =>
  penalties.value.filter((penalty) => {
    if (!isAdmin.value && penalty.employeeId !== currentEmployeeId.value) return false
    if (isAdmin.value && employeeFilter.value !== 'all' && penalty.employeeId !== Number(employeeFilter.value)) return false
    if (periodFilter.value !== 'all') {
      const days = periodFilter.value === 'week' ? 7 : 30
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
      if (new Date(penalty.createdAt).getTime() < cutoff) return false
    }
    return true
  })
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'date', label: t('penalties.columnDate'), width: 120, sortable: true, sortAccessor: (row) => new Date(row.createdAt).getTime() },
  ...(isAdmin.value
    ? [{ key: 'employee', label: t('penalties.columnEmployee'), width: 170, sortable: true, pinnable: true, sortAccessor: (row: any) => getEmployee(row.employeeId)?.fullName ?? '' }]
    : []),
  { key: 'amount', label: t('penalties.columnAmount'), width: 110, sortable: true, sortAccessor: (row) => row.amount },
  { key: 'reason', label: t('penalties.columnReason'), width: 260 },
  { key: 'issuedBy', label: t('penalties.columnIssuedBy'), width: 160 },
  { key: 'ticket', label: t('penalties.columnTicket'), width: 90 }
])

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value)
}
</script>

<style scoped>
.penalties-list__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.penalties-list__filters > * {
  min-width: 180px;
  flex: 1 1 180px;
}

.penalties-list__amount {
  color: var(--color-danger);
  font-weight: 600;
}
</style>
