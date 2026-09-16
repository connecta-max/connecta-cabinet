<template>
  <BaseCard :title="t('settingsInterface.title')" class="settings-interface">
    <div class="settings-interface__body">
      <BaseSelect v-model="theme" :label="t('settingsInterface.defaultTheme')" :options="themeOptions" @update:model-value="onThemeChange" />
      <BaseSelect v-model="language" :label="t('settingsInterface.defaultLanguage')" :options="languageOptions" @update:model-value="onLanguageChange" />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
const { t, setLocale } = useI18n()
const { settings } = useSettings()
const colorMode = useColorMode()

const theme = ref(settings.value.defaultTheme)
const language = ref(settings.value.defaultLocale)

const themeOptions = computed(() => [
  { value: 'light', label: t('settingsInterface.light') },
  { value: 'dark', label: t('settingsInterface.dark') }
])

const languageOptions = computed(() => [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' }
])

function onThemeChange(value: string) {
  settings.value.defaultTheme = value as 'light' | 'dark'
  colorMode.preference = value
}

function onLanguageChange(value: string) {
  settings.value.defaultLocale = value as 'ru' | 'en'
  setLocale(value as 'ru' | 'en')
}
</script>

<style scoped>
.settings-interface {
  max-width: 360px;
}

.settings-interface__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
