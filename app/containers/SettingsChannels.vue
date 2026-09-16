<template>
  <div class="settings-channels">
    <BaseCard :title="t('settingsChannels.telegramTitle')">
      <div class="settings-channels__row">
        <BaseInput v-model="token" :label="t('settingsChannels.telegramToken')" placeholder="123456:AA..." />
        <div class="settings-channels__status">
          <span class="settings-channels__label">{{ t('settingsChannels.telegramStatus') }}</span>
          <span :class="settings.channels.telegramConnected ? 'settings-channels__ok' : 'settings-channels__off'">
            {{ settings.channels.telegramConnected ? t('settingsChannels.connected') : t('settingsChannels.disconnected') }}
          </span>
        </div>
      </div>
      <BaseButton @click="onSaveToken">{{ t('settingsChannels.save') }}</BaseButton>
    </BaseCard>

    <BaseCard :title="t('settingsChannels.widgetTitle')">
      <p class="settings-channels__hint">{{ t('settingsChannels.widgetHint') }}</p>
      <pre class="settings-channels__snippet">{{ settings.channels.widgetSnippet }}</pre>
      <BaseButton variant="secondary" @click="onCopy">
        <Check v-if="copied" :size="14" />
        <Copy v-else :size="14" />
        {{ copied ? t('settingsChannels.copied') : t('settingsChannels.copy') }}
      </BaseButton>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { Check, Copy } from '@lucide/vue'

const { t } = useI18n()
const { settings, saveTelegramToken } = useSettings()

const token = ref(settings.value.channels.telegramToken)
const copied = ref(false)

function onSaveToken() {
  saveTelegramToken(token.value)
}

async function onCopy() {
  try {
    await navigator.clipboard.writeText(settings.value.channels.widgetSnippet)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<style scoped>
.settings-channels {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 640px;
}

.settings-channels__row {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  margin-bottom: 16px;
}

.settings-channels__row > *:first-child {
  flex: 1;
}

.settings-channels__status {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-channels__label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.settings-channels__ok {
  color: var(--color-success);
  font-weight: 600;
  font-size: 13px;
}

.settings-channels__off {
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: 13px;
}

.settings-channels__hint {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.settings-channels__snippet {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0 0 12px;
}
</style>
