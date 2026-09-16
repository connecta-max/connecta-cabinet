<template>
  <div class="data-table">
    <div class="data-table__scroll">
      <table class="data-table__table" :style="{ minWidth: `${totalWidth}px` }">
        <colgroup>
          <col v-for="col in orderedColumns" :key="col.key" :style="{ width: `${col.width}px` }" />
        </colgroup>
        <thead>
          <tr>
            <th
              v-for="col in orderedColumns"
              :key="col.key"
              class="data-table__th"
              :class="pinClass(col)"
              :style="cellStyle(col)"
            >
              <div class="data-table__th-inner" :class="`data-table__th-inner--${col.align ?? 'left'}`">
                <button v-if="col.sortable" type="button" class="data-table__sort-btn" @click="toggleSort(col)">
                  {{ col.label }}
                  <ChevronUp v-if="sortKey === col.key && sortDir === 'asc'" :size="12" />
                  <ChevronDown v-else-if="sortKey === col.key && sortDir === 'desc'" :size="12" />
                  <ChevronsUpDown v-else :size="12" class="data-table__sort-icon--idle" />
                </button>
                <span v-else class="data-table__th-label">{{ col.label }}</span>
                <button
                  v-if="col.pinnable"
                  type="button"
                  class="data-table__pin-btn"
                  :class="{ 'data-table__pin-btn--active': pinned[col.key] }"
                  :title="pinned[col.key] ? t('common.unpinColumn') : t('common.pinColumn')"
                  @click="togglePin(col)"
                >
                  <Lock v-if="pinned[col.key]" :size="12" />
                  <LockOpen v-else :size="12" />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in pagedRows"
            :key="rowKey(row)"
            class="data-table__row"
            :class="[{ 'data-table__row--clickable': rowClickable }, rowClass ? rowClass(row) : undefined]"
            @click="rowClickable && $emit('row-click', row)"
          >
            <td v-for="col in orderedColumns" :key="col.key" class="data-table__td" :class="pinClass(col)" :style="cellStyle(col)">
              <slot :name="`cell-${col.key}`" :row="row">{{ col.sortAccessor ? col.sortAccessor(row) : row[col.key] }}</slot>
            </td>
          </tr>
          <tr v-if="pagedRows.length === 0">
            <td :colspan="orderedColumns.length" class="data-table__empty">{{ emptyText ?? t('common.noResults') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="rows.length > 0" class="data-table__footer">
      <div class="data-table__page-size">
        <span class="data-table__page-size-label">{{ t('common.rowsPerPage') }}</span>
        <BaseSelect :model-value="String(pageSize)" :options="pageSizeOptions" @update:model-value="onPageSizeChange" />
      </div>

      <div v-if="totalPages > 1" class="data-table__pager">
        <button type="button" class="data-table__page-btn" :disabled="page === 1" @click="page = page - 1">
          <ChevronLeft :size="16" />
        </button>
        <template v-for="(item, idx) in pageItems" :key="idx">
          <span v-if="item === 'ellipsis'" class="data-table__page-ellipsis">…</span>
          <button
            v-else
            type="button"
            class="data-table__page-btn data-table__page-btn--number"
            :class="{ 'data-table__page-btn--active': item === page }"
            @click="page = item"
          >
            {{ item }}
          </button>
        </template>
        <button type="button" class="data-table__page-btn" :disabled="page === totalPages" @click="page = page + 1">
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown, Lock, LockOpen } from '@lucide/vue'

export interface DataTableColumn {
  key: string
  label: string
  width: number
  sortable?: boolean
  pinnable?: boolean
  align?: 'left' | 'right' | 'center'
  sortAccessor?: (row: any) => string | number
}

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    rows: any[]
    rowKey: (row: any) => string | number
    pageSize?: number
    pageSizeOptions?: number[]
    rowClickable?: boolean
    rowClass?: (row: any) => string | Record<string, boolean>
    emptyText?: string
  }>(),
  { pageSize: 10, pageSizeOptions: () => [10, 20, 50], rowClickable: false }
)

defineEmits<{ 'row-click': [row: any] }>()

const { t } = useI18n()

const pinned = reactive<Record<string, 'left' | 'right'>>({})
const sortKey = ref<string | null>(null)
const sortDir = ref<'asc' | 'desc'>('asc')
const page = ref(1)
const pageSize = ref(props.pageSize)

const pageSizeOptions = computed(() => props.pageSizeOptions.map((n) => ({ value: String(n), label: String(n) })))

function onPageSizeChange(value: string) {
  pageSize.value = Number(value)
  page.value = 1
}

watch(
  () => props.rows,
  () => {
    page.value = 1
  }
)

function togglePin(col: DataTableColumn) {
  if (pinned[col.key]) {
    delete pinned[col.key]
    return
  }
  const idx = props.columns.findIndex((c) => c.key === col.key)
  const mid = (props.columns.length - 1) / 2
  pinned[col.key] = idx <= mid ? 'left' : 'right'
}

function toggleSort(col: DataTableColumn) {
  if (!col.sortable) return
  if (sortKey.value !== col.key) {
    sortKey.value = col.key
    sortDir.value = 'asc'
  } else if (sortDir.value === 'asc') {
    sortDir.value = 'desc'
  } else {
    sortKey.value = null
  }
}

const orderedColumns = computed(() => {
  const left = props.columns.filter((c) => pinned[c.key] === 'left')
  const right = props.columns.filter((c) => pinned[c.key] === 'right')
  const middle = props.columns.filter((c) => !pinned[c.key])
  return [...left, ...middle, ...right]
})

const totalWidth = computed(() => props.columns.reduce((sum, c) => sum + c.width, 0))

function pinClass(col: DataTableColumn) {
  const side = pinned[col.key]
  if (!side) return undefined
  const list = orderedColumns.value
  const idx = list.findIndex((c) => c.key === col.key)
  const isEdge =
    side === 'left' ? list[idx + 1] && pinned[list[idx + 1].key] !== 'left' : list[idx - 1] && pinned[list[idx - 1].key] !== 'right'
  return {
    'data-table__cell--pinned': true,
    [`data-table__cell--pinned-${side}`]: true,
    'data-table__cell--pinned-edge': isEdge
  }
}

function cellStyle(col: DataTableColumn) {
  const side = pinned[col.key]
  // Pinned columns need an exact, locked width so their sticky offsets stay correct.
  // Unpinned columns only get a minimum width and are free to grow, so real data
  // fills the table's full stretched width instead of leaving dead space.
  const style: Record<string, string> = side
    ? { width: `${col.width}px`, minWidth: `${col.width}px`, maxWidth: `${col.width}px` }
    : { minWidth: `${col.width}px` }
  if (col.align) style.textAlign = col.align
  if (side === 'left') {
    const before = orderedColumns.value.filter((c) => pinned[c.key] === 'left' && orderedColumns.value.indexOf(c) < orderedColumns.value.indexOf(col))
    style.position = 'sticky'
    style.left = `${before.reduce((sum, c) => sum + c.width, 0)}px`
    style.zIndex = '2'
  } else if (side === 'right') {
    const after = orderedColumns.value.filter((c) => pinned[c.key] === 'right' && orderedColumns.value.indexOf(c) > orderedColumns.value.indexOf(col))
    style.position = 'sticky'
    style.right = `${after.reduce((sum, c) => sum + c.width, 0)}px`
    style.zIndex = '2'
  }
  return style
}

function getSortValue(row: any, col: DataTableColumn) {
  return col.sortAccessor ? col.sortAccessor(row) : row[col.key]
}

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows
  const col = props.columns.find((c) => c.key === sortKey.value)
  if (!col) return props.rows
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...props.rows].sort((a, b) => {
    const va = getSortValue(a, col)
    const vb = getSortValue(b, col)
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
    return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value)))

watch(totalPages, (total) => {
  if (page.value > total) page.value = total
})

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})

type PageItem = number | 'ellipsis'

const pageItems = computed<PageItem[]>(() => {
  const total = totalPages.value
  const current = page.value
  const keep = new Set<number>()
  keep.add(1)
  keep.add(total)
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) keep.add(p)
  }
  const sorted = [...keep].sort((a, b) => a - b)
  const items: PageItem[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push('ellipsis')
    items.push(p)
    prev = p
  }
  return items
})
</script>

<style scoped>
.data-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-table__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
}

.data-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table__th {
  text-align: left;
  padding: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.data-table__th-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
}

.data-table__th-inner--right {
  justify-content: flex-end;
}

.data-table__th-inner--center {
  justify-content: center;
}

.data-table__sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  color: inherit;
  cursor: pointer;
}

.data-table__sort-btn:hover {
  color: var(--color-text);
}

.data-table__sort-icon--idle {
  opacity: 0.5;
}

.data-table__pin-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  border: none;
  background: none;
  padding: 2px;
  border-radius: 4px;
  color: var(--color-text-muted);
  opacity: 0.5;
  cursor: pointer;
}

.data-table__th:hover .data-table__pin-btn {
  opacity: 1;
}

.data-table__pin-btn--active {
  opacity: 1;
  color: var(--color-accent);
}

.data-table__td {
  padding: 10px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
  background: var(--color-surface);
}

.data-table__row--clickable {
  cursor: pointer;
}

.data-table__row--clickable:hover .data-table__td {
  background: var(--color-surface-alt);
}

.data-table__cell--pinned {
  background: var(--color-surface);
}

.data-table__row--clickable:hover .data-table__cell--pinned {
  background: var(--color-surface-alt);
}

.data-table__cell--pinned-left.data-table__cell--pinned-edge {
  box-shadow: inset -6px 0 6px -6px rgba(0, 0, 0, 0.35);
}

.data-table__cell--pinned-right.data-table__cell--pinned-edge {
  box-shadow: inset 6px 0 6px -6px rgba(0, 0, 0, 0.35);
}

.data-table__empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 24px;
}

.data-table__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 4px;
}

.data-table__page-size {
  display: flex;
  align-items: center;
  gap: 10px;
}

.data-table__page-size-label {
  font-size: 13px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.data-table__page-size :deep(.base-field) {
  gap: 0;
}

.data-table__page-size :deep(.base-select__trigger) {
  min-width: 64px;
  height: 36px;
}

.data-table__pager {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  flex-wrap: wrap;
}

.data-table__page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.data-table__page-btn:hover:not(:disabled):not(.data-table__page-btn--active) {
  border-color: var(--color-accent);
}

.data-table__page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.data-table__page-btn--active {
  background: var(--color-accent);
  border-color: transparent;
  color: var(--color-accent-contrast);
}

.data-table__page-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-muted);
}
</style>
