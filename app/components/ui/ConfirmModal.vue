<template>
  <BaseModal :model-value="modelValue" :title="title" @update:model-value="$emit('update:modelValue', $event)">
    <p class="confirm-modal__message">{{ message }}</p>
    <div class="confirm-modal__actions">
      <BaseButton variant="secondary" @click="$emit('update:modelValue', false)">{{ cancelLabel ?? t('common.cancel') }}</BaseButton>
      <BaseButton :variant="variant" @click="onConfirm">{{ confirmLabel ?? t('common.confirm') }}</BaseButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
  }>(),
  { variant: 'danger' }
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: [] }>()

const { t } = useI18n()

function onConfirm() {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<style scoped>
.confirm-modal__message {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.confirm-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
