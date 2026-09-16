<template>
  <BaseCard class="login-form">
    <div class="login-form__logo-wrap">
      <AppLogo :height="48" />
    </div>
    <h1 class="login-form__title">{{ t('login.title') }}</h1>

    <form class="login-form__fields" @submit.prevent="onSubmit">
      <BaseInput v-model="email" :label="t('login.emailLabel')" type="email" required />
      <BaseInput v-model="password" :label="t('login.passwordLabel')" type="password" required />
      <p v-if="error" class="login-form__error">{{ t('login.error') }}</p>
      <BaseButton type="submit">{{ t('login.submit') }}</BaseButton>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref(false)

function onSubmit() {
  const success = login(email.value, password.value)
  if (success) {
    error.value = false
    navigateTo('/tickets')
  } else {
    error.value = true
  }
}
</script>

<style scoped>
.login-form {
  width: 360px;
  max-width: 100%;
  text-align: center;
}

.login-form__logo-wrap {
  display: flex;
  justify-content: center;
  margin: 4px 0 20px;
}

.login-form__title {
  margin: 0 0 20px;
  font-size: 18px;
}

.login-form__fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

.login-form__error {
  margin: 0;
  font-size: 12px;
  color: var(--color-danger);
}

</style>
