<template>
  <BaseCard :title="t('settingsTemplates.title')">
    <template #actions>
      <BaseButton size="sm" @click="openNew"><Plus :size="14" />{{ t('settingsTemplates.addTemplate') }}</BaseButton>
    </template>

    <div class="settings-templates__list">
      <div v-for="template in templates" :key="template.id" class="settings-templates__item">
        <div>
          <p class="settings-templates__name">{{ template.name }}</p>
          <p class="settings-templates__content">{{ template.content }}</p>
        </div>
        <div class="settings-templates__actions">
          <BaseButton size="sm" variant="secondary" @click="openEdit(template)"><Pencil :size="14" />{{ t('common.edit') }}</BaseButton>
          <BaseButton size="sm" variant="danger" @click="removeTemplate(template.id)"><Trash2 :size="14" />{{ t('common.delete') }}</BaseButton>
        </div>
      </div>
    </div>

    <BaseModal v-model="modalOpen" :title="editingId ? t('common.edit') : t('settingsTemplates.addTemplate')">
      <BaseInput v-model="name" :label="t('settingsTemplates.nameLabel')" />
      <BaseTextarea v-model="content" :label="t('settingsTemplates.contentLabel')" :rows="3" />
      <BaseButton :disabled="!name.trim() || !content.trim()" @click="onSubmit">{{ t('common.save') }}</BaseButton>
    </BaseModal>
  </BaseCard>
</template>

<script setup lang="ts">
import { Pencil, Plus, Trash2 } from '@lucide/vue'

import type { ResponseTemplate } from '~/types'

const { t } = useI18n()
const { templates, addTemplate, updateTemplate, removeTemplate } = useTemplates()

const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const name = ref('')
const content = ref('')

function openNew() {
  editingId.value = null
  name.value = ''
  content.value = ''
  modalOpen.value = true
}

function openEdit(template: ResponseTemplate) {
  editingId.value = template.id
  name.value = template.name
  content.value = template.content
  modalOpen.value = true
}

function onSubmit() {
  if (editingId.value) {
    updateTemplate(editingId.value, { name: name.value.trim(), content: content.value.trim() })
  } else {
    addTemplate({ name: name.value.trim(), content: content.value.trim() })
  }
  modalOpen.value = false
}
</script>

<style scoped>
.settings-templates__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-templates__item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.settings-templates__name {
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 13px;
}

.settings-templates__content {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.settings-templates__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-self: flex-start;
}
</style>
