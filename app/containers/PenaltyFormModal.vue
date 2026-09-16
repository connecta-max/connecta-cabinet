<template>
  <BaseModal :model-value="modelValue" :title="t('penaltyForm.title')" @update:model-value="$emit('update:modelValue', $event)">
    <BaseSelect v-if="!employeeId" v-model="selectedEmployeeId" :label="t('penaltyForm.employee')" :options="employeeOptions" />

    <BaseSelect v-model="preset" :label="t('penaltyForm.presets')" :options="presetOptions" @update:model-value="onPresetChange" />

    <BaseInput v-model="amount" :label="t('penaltyForm.amount')" type="number" />
    <BaseTextarea v-model="reason" :label="t('penaltyForm.reason')" :rows="2" />

    <p v-if="ticketId" class="penalty-form__ticket">{{ t('penaltyForm.relatedTicket') }}: #{{ ticketId }}</p>

    <BaseButton :disabled="!canSubmit" @click="onSubmit">{{ t('penaltyForm.submit') }}</BaseButton>
  </BaseModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  employeeId?: number | null
  ticketId?: number | null
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { t } = useI18n()
const { employees } = useEmployees()
const { issuePenalty } = usePenalties()
const { currentEmployee } = useAuth()

const employeeOptions = computed(() => employees.value.map((employee) => ({ value: String(employee.id), label: employee.fullName })))
const selectedEmployeeId = ref(String(props.employeeId ?? employees.value[0]?.id ?? ''))

const preset = ref('late')
const amount = ref('500')
const reason = ref(t('penaltyForm.presetLate'))

const presetOptions = computed(() => [
  { value: 'late', label: t('penaltyForm.presetLate') },
  { value: 'rude', label: t('penaltyForm.presetRude') },
  { value: 'mistake', label: t('penaltyForm.presetMistake') },
  { value: 'custom', label: t('penaltyForm.presetCustom') }
])

function onPresetChange(value: string) {
  if (value === 'late') {
    amount.value = '500'
    reason.value = t('penaltyForm.presetLate')
  } else if (value === 'rude') {
    amount.value = '1000'
    reason.value = t('penaltyForm.presetRude')
  } else if (value === 'mistake') {
    amount.value = '700'
    reason.value = t('penaltyForm.presetMistake')
  } else {
    reason.value = ''
  }
}

const canSubmit = computed(() => Number(amount.value) > 0 && reason.value.trim().length > 0)

function onSubmit() {
  const employeeId = props.employeeId ?? Number(selectedEmployeeId.value)
  issuePenalty({
    employeeId,
    amount: Number(amount.value),
    reason: reason.value.trim(),
    issuedBy: currentEmployee.value?.fullName ?? 'admin',
    ticketId: props.ticketId ?? null
  })
  emit('update:modelValue', false)
  preset.value = 'late'
  amount.value = '500'
  reason.value = t('penaltyForm.presetLate')
}
</script>

<style scoped>
.penalty-form__ticket {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
