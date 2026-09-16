<template>
  <div v-if="employee" class="employee-card">
    <BackLink to="/employees" :label="t('employeeCard.backToList')" />

    <div class="employee-card__layout">
      <BaseCard :title="employee.fullName">
        <div class="employee-card__info">
          <BaseAvatar :name="employee.fullName" />
          <div>
            <p class="employee-card__login">{{ employee.login }}</p>
            <p class="employee-card__email">{{ employee.email }}</p>
          </div>
        </div>

        <h3 class="employee-card__section-title">{{ t('employeeCard.rights') }}</h3>
        <div class="employee-card__rights">
          <BaseCheckbox v-model="canReply" :label="t('employeeCard.canReply')" @update:model-value="onRightsChange" />
          <BaseCheckbox v-model="canLeaveNotes" :label="t('employeeCard.canLeaveNotes')" @update:model-value="onRightsChange" />
        </div>

        <BaseButton v-if="canIssuePenalties" variant="danger" @click="penaltyModalOpen = true">{{ t('employeeCard.issuePenalty') }}</BaseButton>
      </BaseCard>

      <BaseCard :title="t('employeeCard.penaltyHistory')">
        <div class="employee-card__penalties">
          <div v-for="penalty in penalties" :key="penalty.id" class="employee-card__penalty">
            <div class="employee-card__penalty-row">
              <span class="employee-card__penalty-amount">−{{ penalty.amount }} ₽</span>
              <span class="employee-card__penalty-date">{{ formatDate(penalty.createdAt) }}</span>
            </div>
            <p class="employee-card__penalty-reason">{{ penalty.reason }}</p>
            <p class="employee-card__penalty-meta">
              {{ penalty.issuedBy === 'system' ? t('penalties.automatic') : penalty.issuedBy }}
              <template v-if="penalty.ticketId"> · #{{ penalty.ticketId }}</template>
            </p>
          </div>
          <p v-if="penalties.length === 0" class="employee-card__muted">{{ t('employeeCard.noPenalties') }}</p>
        </div>
      </BaseCard>
    </div>

    <PenaltyFormModal v-model="penaltyModalOpen" :employee-id="employee.id" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ employeeId: number }>()

const { t, locale } = useI18n()
const { getEmployee, updateRights } = useEmployees()
const { canIssuePenalties } = usePermissions()
const { penaltiesFor } = usePenalties()

const employee = computed(() => getEmployee(props.employeeId))
const penalties = penaltiesFor(props.employeeId)

const canReply = ref(employee.value?.canReply ?? false)
const canLeaveNotes = ref(employee.value?.canLeaveNotes ?? false)
const penaltyModalOpen = ref(false)

function onRightsChange() {
  updateRights(props.employeeId, { canReply: canReply.value, canLeaveNotes: canLeaveNotes.value })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value)
}
</script>

<style scoped>
.employee-card__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 1fr);
  gap: 20px;
  align-items: start;
}

.employee-card__info {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.employee-card__login,
.employee-card__email {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.employee-card__section-title {
  font-size: 13px;
  margin: 0 0 10px;
}

.employee-card__rights {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.employee-card__penalties {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.employee-card__penalty {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
}

.employee-card__penalty-row {
  display: flex;
  justify-content: space-between;
}

.employee-card__penalty-amount {
  font-weight: 600;
  color: var(--color-danger);
}

.employee-card__penalty-date {
  font-size: 12px;
  color: var(--color-text-muted);
}

.employee-card__penalty-reason {
  margin: 4px 0 2px;
  font-size: 13px;
}

.employee-card__penalty-meta {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.employee-card__muted {
  color: var(--color-text-muted);
  font-size: 13px;
}

@media (max-width: 900px) {
  .employee-card__layout {
    grid-template-columns: 1fr;
  }
}
</style>
