<template>
  <BaseModal :model-value="modelValue" :title="t('personInfo.title')" @update:model-value="$emit('update:modelValue', $event)">
    <template v-if="employee">
      <div class="person-info__header">
        <BaseAvatar :name="employee.fullName" />
        <div>
          <p class="person-info__name">{{ employee.fullName }}</p>
          <p class="person-info__muted">{{ employee.login }}</p>
        </div>
      </div>
      <dl class="person-info__fields">
        <dt>Email</dt>
        <dd>{{ employee.email }}</dd>
        <dt>{{ t('personInfo.role') }}</dt>
        <dd>{{ employee.role === 'admin' ? t('personInfo.roleAdmin') : t('personInfo.roleSupport') }}</dd>
        <dt>{{ t('employees.columnStatus') }}</dt>
        <dd>{{ employee.active ? t('employeeStatus.active') : t('employeeStatus.inactive') }}</dd>
        <dt>{{ t('employeeCard.rights') }}</dt>
        <dd>
          <span v-if="employee.canReply">{{ t('employeeCard.canReply') }}</span>
          <span v-if="employee.canReply && employee.canLeaveNotes"> · </span>
          <span v-if="employee.canLeaveNotes">{{ t('employeeCard.canLeaveNotes') }}</span>
          <span v-if="!employee.canReply && !employee.canLeaveNotes" class="person-info__muted">—</span>
        </dd>
      </dl>
      <NuxtLink v-if="canViewEmployees" :to="`/employees/${employee.id}`" class="person-info__link" @click="$emit('update:modelValue', false)">
        {{ t('personInfo.openEmployeeCard') }}
      </NuxtLink>
    </template>

    <template v-else-if="client">
      <div class="person-info__header">
        <BaseAvatar :name="client.fullName" />
        <div>
          <p class="person-info__name">{{ client.fullName }}</p>
          <ClientTypeBadge :type="client.type" />
        </div>
      </div>
      <dl class="person-info__fields">
        <dt>Email</dt>
        <dd>{{ client.email }}</dd>
        <dt>{{ t('clients.columnPhone') }}</dt>
        <dd>{{ client.phone }}</dd>
      </dl>
      <NuxtLink v-if="canViewClients" :to="`/clients/${client.id}`" class="person-info__link" @click="$emit('update:modelValue', false)">
        {{ t('personInfo.openClientCard') }}
      </NuxtLink>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  personType: 'employee' | 'client' | null
  personId: number | null
}>()

defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { t } = useI18n()
const { getEmployee } = useEmployees()
const { getClient } = useClients()
const { canViewEmployees, canViewClients } = usePermissions()

const employee = computed(() => (props.personType === 'employee' ? getEmployee(props.personId) : undefined))
const client = computed(() => (props.personType === 'client' ? getClient(props.personId) : undefined))
</script>

<style scoped>
.person-info__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.person-info__name {
  margin: 0;
  font-weight: 600;
}

.person-info__muted {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.person-info__fields {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 6px 12px;
  font-size: 13px;
  margin: 0;
}

.person-info__fields dt {
  color: var(--color-text-muted);
}

.person-info__fields dd {
  margin: 0;
}

.person-info__link {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-accent);
  text-decoration: none;
}

.person-info__link:hover {
  text-decoration: underline;
}
</style>
