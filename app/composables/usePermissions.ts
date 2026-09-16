const RESTRICTED_PREFIXES = ['/employees', '/clients', '/settings']

export function usePermissions() {
  const { currentRole } = useAuth()

  const isAdmin = computed(() => currentRole.value === 'admin')
  const canViewEmployees = isAdmin
  const canViewClients = isAdmin
  const canViewSettings = isAdmin
  // Only admins can issue penalties for now. When a dedicated "can issue penalties"
  // right is introduced for specific employees, this should check that instead of isAdmin.
  const canIssuePenalties = isAdmin

  function isRouteAllowed(path: string): boolean {
    if (isAdmin.value) return true
    return !RESTRICTED_PREFIXES.some((prefix) => path.startsWith(prefix))
  }

  return { isAdmin, canViewEmployees, canViewClients, canViewSettings, canIssuePenalties, isRouteAllowed }
}
