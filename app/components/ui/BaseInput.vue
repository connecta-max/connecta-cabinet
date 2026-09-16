<template>
  <label class="base-field">
    <span v-if="label" class="base-field__label">{{ label }}</span>
    <div class="base-field__wrap">
      <input
        class="base-field__control"
        :class="{ 'base-field__control--suffixed': suffix, 'base-field__control--password': type === 'password' }"
        :type="resolvedType"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="suffix" class="base-field__suffix">{{ suffix }}</span>
      <button
        v-if="type === 'password'"
        type="button"
        class="base-field__toggle"
        tabindex="-1"
        :aria-label="revealed ? t('common.hidePassword') : t('common.showPassword')"
        @click="revealed = !revealed"
      >
        <EyeOff v-if="revealed" :size="16" />
        <Eye v-else :size="16" />
      </button>
    </div>
  </label>
</template>

<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue'

const props = defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  suffix?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const { t } = useI18n()
const revealed = ref(false)

const resolvedType = computed(() => {
  if (props.type !== 'password') return props.type
  return revealed.value ? 'text' : 'password'
})
</script>

<style scoped>
.base-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.base-field__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.base-field__wrap {
  position: relative;
  display: flex;
  min-width: 0;
}

.base-field__control {
  width: 100%;
  min-width: 0;
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 13px;
  font-family: inherit;
}

.base-field__control:focus {
  outline: none;
  border-color: var(--color-accent);
}

.base-field__control--suffixed {
  padding-right: 40px;
}

.base-field__control--password {
  padding-right: 38px;
}

.base-field__suffix {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.base-field__toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
}

.base-field__toggle:hover {
  color: var(--color-text);
}
</style>
