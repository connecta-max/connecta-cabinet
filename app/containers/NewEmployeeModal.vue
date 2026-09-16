<template>
  <BaseModal :model-value="modelValue" :title="t('newEmployee.title')" @update:model-value="$emit('update:modelValue', $event)">
    <BaseInput v-model="fullName" :label="t('newEmployee.fullName')" />
    <BaseInput v-model="login" :label="t('newEmployee.login')" />
    <BaseInput v-model="email" :label="t('newEmployee.email')" type="email" />
    <BaseButton :disabled="!canSubmit" @click="onSubmit">{{ t('newEmployee.submit') }}</BaseButton>
  </BaseModal>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { t } = useI18n()
const { addEmployee } = useEmployees()

const fullName = ref('')
const login = ref('')
const email = ref('')

const canSubmit = computed(() => fullName.value.trim() && login.value.trim() && email.value.trim())

function onSubmit() {
  addEmployee({ fullName: fullName.value.trim(), login: login.value.trim(), email: email.value.trim() })
  fullName.value = ''
  login.value = ''
  email.value = ''
  emit('update:modelValue', false)
}
</script>
