<template>
  <BaseCard :title="t('settingsSla.title')" class="settings-sla">
    <div class="settings-sla__body">
      <h3 class="settings-sla__subtitle">{{ t('settingsSla.responseTime') }}</h3>
      <div class="settings-sla__row">
        <BaseInput v-model="vipMinutes" :label="t('clientType.vip')" type="number" :suffix="t('settingsSla.minutes')" />
        <BaseInput v-model="paidMinutes" :label="t('clientType.paid')" type="number" :suffix="t('settingsSla.minutes')" />
        <BaseInput v-model="freeMinutes" :label="t('clientType.free')" type="number" :suffix="t('settingsSla.minutes')" />
      </div>

      <BaseInput v-model="penaltyAmount" :label="t('settingsSla.defaultPenalty')" type="number" />

      <BaseToggle v-model="autoPenalty" :label="t('settingsSla.autoPenalty')" />

      <BaseButton @click="onSave">{{ t('common.save') }}</BaseButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { settings } = useSettings()

const vipMinutes = ref(String(settings.value.slaMinutes.vip))
const paidMinutes = ref(String(settings.value.slaMinutes.paid))
const freeMinutes = ref(String(settings.value.slaMinutes.free))
const penaltyAmount = ref(String(settings.value.defaultPenaltyAmount))
const autoPenalty = ref(settings.value.autoPenaltyEnabled)

function onSave() {
  settings.value.slaMinutes = {
    vip: Number(vipMinutes.value),
    paid: Number(paidMinutes.value),
    free: Number(freeMinutes.value)
  }
  settings.value.defaultPenaltyAmount = Number(penaltyAmount.value)
  settings.value.autoPenaltyEnabled = autoPenalty.value
}
</script>

<style scoped>
.settings-sla {
  max-width: 640px;
}

.settings-sla__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-sla__body > .base-button {
  align-self: flex-start;
}

.settings-sla__subtitle {
  font-size: 13px;
  margin: 0;
}

.settings-sla__row {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 12px;
  width: 100%;
}

@media (max-width: 520px) {
  .settings-sla__row {
    grid-template-columns: 1fr;
  }
}
</style>
