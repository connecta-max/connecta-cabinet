export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/tickets')
  }

  if (isAuthenticated.value) {
    const { isRouteAllowed } = usePermissions()
    if (!isRouteAllowed(to.path)) {
      return navigateTo('/tickets')
    }
  }
})
