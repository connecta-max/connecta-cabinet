import type { Employee } from '~/types'
import { createRng, pickWeighted } from '~/utils/random'
import { translit } from '~/utils/translit'

function makeLogin(fullName: string): string {
  const [first, last] = fullName.split(' ')
  return `${translit(first ?? '').charAt(0)}.${translit(last ?? '')}`
}

// Names already used by hand-authored employees (below) are excluded here to avoid duplicate namesakes.
const firstNamesM = ['Дмитрий', 'Максим', 'Артём', 'Кирилл', 'Роман', 'Владимир', 'Денис', 'Андрей', 'Виктор', 'Олег', 'Тимофей', 'Ярослав']
const lastNamesM = ['Козлов', 'Морозов', 'Соколов', 'Лебедев', 'Новиков', 'Захаров', 'Орлов', 'Киселёв', 'Тихонов', 'Комаров', 'Воробьёв', 'Фролов']
const firstNamesF = ['Мария', 'Ольга', 'Екатерина', 'Ирина', 'Светлана', 'Юлия', 'Дарья', 'Полина', 'Алина', 'Вера', 'Ксения', 'Виктория']
const lastNamesF = ['Соколова', 'Кузнецова', 'Новикова', 'Морозова', 'Лебедева', 'Захарова', 'Орлова', 'Киселёва', 'Гусева', 'Соловьёва', 'Тихонова', 'Комарова']

function generateEmployees(count: number, startId: number): Employee[] {
  const rng = createRng(4242)
  const result: Employee[] = []
  for (let i = 0; i < count; i++) {
    const isMale = rng() > 0.5
    const first = isMale ? firstNamesM[i % firstNamesM.length] : firstNamesF[i % firstNamesF.length]
    const last = isMale ? lastNamesM[i % lastNamesM.length] : lastNamesF[i % lastNamesF.length]
    const fullName = `${first} ${last}`
    const role = pickWeighted(rng, [
      ['support', 7],
      ['admin', 3]
    ] as const)
    result.push({
      id: startId + i,
      fullName,
      login: makeLogin(fullName),
      email: `${makeLogin(fullName)}@connecta.local`,
      role,
      active: rng() > 0.12,
      canReply: rng() > 0.08,
      canLeaveNotes: rng() > 0.2
    })
  }
  return result
}

const handAuthored: Employee[] = [
  { id: 1, fullName: 'Анна Кравцова', login: 'a.kravtsova', email: 'a.kravtsova@connecta.local', role: 'admin', active: true, canReply: true, canLeaveNotes: true },
  { id: 2, fullName: 'Сергей Ильин', login: 's.ilyin', email: 's.ilyin@connecta.local', role: 'admin', active: true, canReply: true, canLeaveNotes: true },
  { id: 3, fullName: 'Наталья Фомина', login: 'n.fomina', email: 'n.fomina@connecta.local', role: 'admin', active: true, canReply: true, canLeaveNotes: false },
  { id: 4, fullName: 'Павел Егоров', login: 'p.egorov', email: 'p.egorov@connecta.local', role: 'admin', active: false, canReply: true, canLeaveNotes: true },
  { id: 5, fullName: 'Игорь Смирнов', login: 'support', email: 'support@connecta.local', role: 'support', active: true, canReply: true, canLeaveNotes: true }
]

export const SUPPORT_DEMO_EMPLOYEE_ID = 5

const seed: Employee[] = [...handAuthored, ...generateEmployees(15, 6)]

let nextId = seed.length + 1

export function useEmployees() {
  const employees = useState<Employee[]>('employees', () => structuredClone(seed))

  function getEmployee(id: number | null | undefined): Employee | undefined {
    if (id == null) return undefined
    return employees.value.find((employee) => employee.id === id)
  }

  function addEmployee(data: { fullName: string; login: string; email: string }) {
    employees.value.push({
      id: nextId++,
      fullName: data.fullName,
      login: data.login,
      email: data.email,
      role: 'support',
      active: true,
      canReply: true,
      canLeaveNotes: false
    })
  }

  function toggleActive(id: number) {
    const employee = getEmployee(id)
    if (employee) employee.active = !employee.active
  }

  function removeEmployee(id: number) {
    employees.value = employees.value.filter((employee) => employee.id !== id)
  }

  function updateRights(id: number, rights: { canReply: boolean; canLeaveNotes: boolean }) {
    const employee = getEmployee(id)
    if (employee) Object.assign(employee, rights)
  }

  function updateRole(id: number, role: Employee['role']) {
    const employee = getEmployee(id)
    if (employee) employee.role = role
  }

  return { employees, getEmployee, addEmployee, toggleActive, updateRights, updateRole, removeEmployee }
}
