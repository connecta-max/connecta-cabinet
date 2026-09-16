<template>
  <BaseCard :title="t('employees.title')">
    <template #actions>
      <BaseButton size="sm" @click="modalOpen = true"><Plus :size="14" />{{ t('employees.addEmployee') }}</BaseButton>
    </template>

    <BaseTable :columns="columns" :rows="employees" :row-key="(row) => row.id" :page-size="10">
      <template #cell-name="{ row }">
        <button type="button" class="employees-list__name" @click="navigateTo(`/employees/${row.id}`)">
          <BaseAvatar :name="row.fullName" size="sm" />
          {{ row.fullName }}
        </button>
      </template>
      <template #cell-role="{ row }">
        <span class="employees-list__role" :class="{ 'employees-list__role--admin': row.role === 'admin' }">
          {{ row.role === 'admin' ? t('personInfo.roleAdmin') : t('personInfo.roleSupport') }}
        </span>
      </template>
      <template #cell-login="{ row }">{{ row.login }}</template>
      <template #cell-status="{ row }">
        <span class="employees-list__status" :class="{ 'employees-list__status--active': row.active }">
          {{ row.active ? t('employeeStatus.active') : t('employeeStatus.inactive') }}
        </span>
      </template>
      <template #cell-activeTickets="{ row }">{{ activeTicketsCount(row.id) }}</template>
      <template #cell-actions="{ row }">
        <div class="employees-list__actions">
          <BaseButton size="sm" variant="secondary" @click="toggleActive(row.id)">
            {{ row.active ? t('employees.deactivate') : t('employees.activate') }}
          </BaseButton>
          <BaseButton size="sm" variant="danger" :title="t('common.delete')" @click="onDelete(row)">
            <Trash2 :size="14" />
          </BaseButton>
        </div>
      </template>
    </BaseTable>

    <NewEmployeeModal v-model="modalOpen" />
    <ConfirmModal
      v-model="deleteModalOpen"
      :title="t('common.delete')"
      :message="t('employees.confirmDelete', { name: deleteTarget?.fullName ?? '' })"
      :confirm-label="t('common.delete')"
      @confirm="onConfirmDelete"
    />
  </BaseCard>
</template>

<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import type { DataTableColumn } from '~/components/ui/BaseTable.vue'
import type { Employee } from '~/types'

const { t } = useI18n()
const { employees, toggleActive, removeEmployee } = useEmployees()
const { tickets } = useTickets()

const modalOpen = ref(false)

function activeTicketsCount(employeeId: number) {
  return tickets.value.filter((ticket) => ticket.assigneeId === employeeId && ticket.status !== 'closed').length
}

const deleteModalOpen = ref(false)
const deleteTarget = ref<Employee | null>(null)

function onDelete(employee: Employee) {
  deleteTarget.value = employee
  deleteModalOpen.value = true
}

function onConfirmDelete() {
  if (deleteTarget.value) removeEmployee(deleteTarget.value.id)
  deleteTarget.value = null
}

const columns: DataTableColumn[] = [
  { key: 'name', label: t('employees.columnName'), width: 190, sortable: true, pinnable: true, sortAccessor: (row) => row.fullName },
  { key: 'role', label: t('personInfo.role'), width: 110, sortable: true, sortAccessor: (row) => row.role },
  { key: 'login', label: t('employees.columnLogin'), width: 130 },
  { key: 'status', label: t('employees.columnStatus'), width: 110, sortable: true, pinnable: true, align: 'center', sortAccessor: (row) => (row.active ? 1 : 0) },
  {
    key: 'activeTickets',
    label: t('employees.columnActiveTickets'),
    width: 140,
    sortable: true,
    align: 'center',
    sortAccessor: (row) => activeTicketsCount(row.id)
  },
  { key: 'actions', label: t('common.actions'), width: 190 }
]
</script>

<style scoped>
.employees-list__name {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  font-weight: 500;
  color: var(--color-text);
}

.employees-list__name:hover {
  color: var(--color-accent);
}

.employees-list__role {
  font-size: 12px;
  color: var(--color-text-muted);
}

.employees-list__role--admin {
  color: var(--color-accent);
  font-weight: 600;
}

.employees-list__status {
  color: var(--color-text-muted);
}

.employees-list__status--active {
  color: var(--color-success);
}

.employees-list__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  white-space: nowrap;
}

.employees-list__actions :deep(.base-button--danger) {
  padding: 0 8px;
}
</style>
