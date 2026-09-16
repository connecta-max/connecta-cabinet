<template>
  <Teleport to="body">
    <div v-if="src" class="image-lightbox" @click="onBackdropClick" @wheel.prevent="onWheel">
      <div class="image-lightbox__toolbar">
        <button type="button" class="image-lightbox__tool" :disabled="scale <= minScale" :title="t('common.zoomOut')" @click.stop="zoomOut">
          <Minus :size="18" />
        </button>
        <span class="image-lightbox__scale">{{ Math.round(scale * 100) }}%</span>
        <button type="button" class="image-lightbox__tool" :disabled="scale >= maxScale" :title="t('common.zoomIn')" @click.stop="zoomIn">
          <Plus :size="18" />
        </button>
        <button v-if="scale !== 1" type="button" class="image-lightbox__tool" :title="t('common.resetZoom')" @click.stop="resetZoom">
          <RotateCcw :size="16" />
        </button>
      </div>

      <button type="button" class="image-lightbox__close" :aria-label="t('common.close')" @click="$emit('close')">
        <X :size="22" />
      </button>

      <div class="image-lightbox__viewport">
        <img
          :src="src"
          :alt="alt"
          class="image-lightbox__image"
          :class="{ 'image-lightbox__image--zoomed': scale > 1 }"
          :style="imageStyle"
          draggable="false"
          @click.stop
          @dblclick.stop="onDoubleClick"
          @pointerdown="onPointerDown"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Minus, Plus, RotateCcw, X } from '@lucide/vue'

const props = defineProps<{ src: string | null; alt?: string }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()

const minScale = 1
const maxScale = 4
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)

const imageStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`
}))

function resetZoom() {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

function zoomIn() {
  scale.value = Math.min(maxScale, Math.round((scale.value + 0.5) * 10) / 10)
}

function zoomOut() {
  scale.value = Math.max(minScale, Math.round((scale.value - 0.5) * 10) / 10)
  if (scale.value === 1) {
    offsetX.value = 0
    offsetY.value = 0
  }
}

function onWheel(event: WheelEvent) {
  if (event.deltaY < 0) zoomIn()
  else zoomOut()
}

function onDoubleClick() {
  if (scale.value > 1) resetZoom()
  else scale.value = 2
}

function onBackdropClick() {
  if (scale.value > 1) return
  emit('close')
}

let dragging = false
let dragStartX = 0
let dragStartY = 0
let dragOriginX = 0
let dragOriginY = 0

function onPointerDown(event: PointerEvent) {
  if (scale.value <= 1) return
  dragging = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragOriginX = offsetX.value
  dragOriginY = offsetY.value
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture(event.pointerId)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging) return
  offsetX.value = dragOriginX + (event.clientX - dragStartX)
  offsetY.value = dragOriginY + (event.clientY - dragStartY)
}

function onPointerUp() {
  dragging = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
  else if (event.key === '+' || event.key === '=') zoomIn()
  else if (event.key === '-') zoomOut()
}

watch(
  () => props.src,
  (value) => {
    resetZoom()
    if (value) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>

<style scoped>
.image-lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(0, 0, 0, 0.85);
  cursor: zoom-out;
}

.image-lightbox__viewport {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-lightbox__image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  cursor: zoom-in;
  transition: transform 0.15s ease;
  touch-action: none;
}

.image-lightbox__image--zoomed {
  cursor: grab;
}

.image-lightbox__image--zoomed:active {
  cursor: grabbing;
}

.image-lightbox__close {
  position: absolute;
  top: 20px;
  right: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  cursor: pointer;
}

.image-lightbox__close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.image-lightbox__toolbar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(20, 20, 30, 0.6);
  backdrop-filter: blur(6px);
  z-index: 1;
}

.image-lightbox__tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: none;
  color: #ffffff;
  cursor: pointer;
}

.image-lightbox__tool:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.image-lightbox__tool:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.image-lightbox__scale {
  min-width: 44px;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
}
</style>
