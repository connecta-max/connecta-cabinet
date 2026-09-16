import type { EmployeeRole } from '~/types'

interface DemoAccount {
  email: string
  password: string
  employeeId: number
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: 'admin@connecta.local', password: 'admin123', employeeId: 1 },
  { email: 'support@connecta.local', password: 'support123', employeeId: 5 }
]

export function useAuth() {
  const currentUser = useCookie<string | null>('connecta-user', { default: () => null })
  const currentEmployeeId = useCookie<number | null>('connecta-employee-id', { default: () => null })

  const isAuthenticated = computed(() => Boolean(currentUser.value))

  const { getEmployee } = useEmployees()
  const currentEmployee = computed(() => getEmployee(currentEmployeeId.value ?? undefined))
  const currentRole = computed<EmployeeRole>(() => currentEmployee.value?.role ?? 'support')

  function login(email: string, password: string): boolean {
    const account = DEMO_ACCOUNTS.find(
      (candidate) => candidate.email === email.trim().toLowerCase() && candidate.password === password
    )
    if (account) {
      currentUser.value = account.email
      currentEmployeeId.value = account.employeeId
      return true
    }
    return false
  }

  function logout() {
    currentUser.value = null
    currentEmployeeId.value = null
  }

  return { currentUser, currentEmployeeId, currentEmployee, currentRole, isAuthenticated, login, logout }
}
