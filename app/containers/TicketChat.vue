<template>
  <div class="ticket-chat">
    <div ref="scrollEl" class="ticket-chat__messages">
      <template v-for="item in timeline" :key="`${item.kind}-${item.data.id}`">
        <div v-if="item.kind === 'note'" class="ticket-chat__note">
          <StickyNote :size="13" />
          <div class="ticket-chat__note-body">
            <div class="ticket-chat__note-header">
              <button type="button" class="ticket-chat__author-btn" @click="openPerson('employee', item.data.authorId)">
                {{ item.data.authorName }}
              </button>
              <span class="ticket-chat__time">{{ formatTime(item.data.createdAt) }}</span>
              <span class="ticket-chat__note-tag">{{ t('ticketCard.noteTag') }}</span>
            </div>
            <p class="ticket-chat__text">{{ item.data.text }}</p>
          </div>
        </div>

        <div v-else class="ticket-chat__message" :class="`ticket-chat__message--${item.data.author}`">
          <button type="button" class="ticket-chat__avatar-btn" @click="openPerson(item.data.author === 'client' ? 'client' : 'employee', item.data.author === 'client' ? ticket?.clientId ?? null : item.data.authorId)">
            <BaseAvatar :name="authorLabel(item.data)" size="sm" />
          </button>
          <div class="ticket-chat__bubble">
            <div class="ticket-chat__bubble-header">
              <button type="button" class="ticket-chat__author-btn" @click="openPerson(item.data.author === 'client' ? 'client' : 'employee', item.data.author === 'client' ? ticket?.clientId ?? null : item.data.authorId)">
                {{ authorLabel(item.data) }}
              </button>
              <span class="ticket-chat__time">{{ formatTime(item.data.createdAt) }}</span>
            </div>
            <p v-if="item.data.text" class="ticket-chat__text">{{ item.data.text }}</p>

            <div v-if="item.data.attachments.length" class="ticket-chat__attachments">
              <template v-for="attachment in item.data.attachments" :key="attachment.id">
                <button v-if="attachment.kind === 'image'" type="button" class="ticket-chat__image-btn" @click="openLightbox(attachment.url)">
                  <img :src="attachment.url" :alt="attachment.name" class="ticket-chat__image" />
                </button>
                <div v-else-if="attachment.kind === 'voice'" class="ticket-chat__voice">
                  <button type="button" class="ticket-chat__voice-play" @click="togglePlay(attachment)">
                    <Pause v-if="playingId === attachment.id" :size="14" />
                    <Play v-else :size="14" />
                  </button>
                  <span class="ticket-chat__voice-wave">
                    <span v-for="bar in waveBars(attachment.id)" :key="bar.i" class="ticket-chat__voice-bar" :style="{ height: `${bar.h}px` }" />
                  </span>
                  <span class="ticket-chat__voice-duration">{{ formatDuration(attachment.durationSec ?? 0) }}</span>
                </div>
                <a
                  v-else
                  class="ticket-chat__attachment"
                  :class="{ 'ticket-chat__attachment--link': attachment.url }"
                  :href="attachment.url"
                  :download="attachment.url ? attachment.name : undefined"
                  :target="attachment.url ? '_blank' : undefined"
                  rel="noopener"
                  @click="!attachment.url && $event.preventDefault()"
                >
                  <Paperclip :size="13" />
                  {{ attachment.name }}
                  <Download v-if="attachment.url" :size="12" class="ticket-chat__attachment-download" />
                </a>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>

    <form class="ticket-chat__composer" @submit.prevent="onSend">
      <div v-if="pendingAttachments.length" class="ticket-chat__pending">
        <span v-for="pending in pendingAttachments" :key="pending.id" class="ticket-chat__pending-chip">
          <img v-if="pending.kind === 'image'" :src="pending.url" class="ticket-chat__pending-thumb" alt="" />
          <Mic v-else-if="pending.kind === 'voice'" :size="12" />
          <Paperclip v-else :size="12" />
          {{ pending.kind === 'voice' ? t('ticketCard.voiceMessagePending', { duration: formatDuration(pending.durationSec ?? 0) }) : pending.name }}
          <button type="button" class="ticket-chat__pending-remove" @click="removePending(pending.id)"><X :size="12" /></button>
        </span>
      </div>

      <BaseTextarea v-model="draft" :placeholder="t('ticketCard.messagePlaceholder')" :rows="2" />

      <div v-if="isRecording" class="ticket-chat__recording">
        <span class="ticket-chat__recording-dot" />
        <span class="ticket-chat__recording-label">{{ t('ticketCard.recording') }} {{ formatDuration(recordingSeconds) }}</span>
        <div class="ticket-chat__recording-actions">
          <BaseButton type="button" variant="secondary" size="sm" @click="cancelRecording">
            <X :size="14" />{{ t('common.cancel') }}
          </BaseButton>
          <BaseButton type="button" size="sm" @click="stopRecording">
            <Send :size="14" />{{ t('ticketCard.stopRecording') }}
          </BaseButton>
        </div>
      </div>

      <div v-else class="ticket-chat__toolbar">
        <input ref="fileInputRef" type="file" multiple class="ticket-chat__file-input" @change="onFilesSelected" />
        <button type="button" class="ticket-chat__icon-btn" :title="t('ticketCard.attach')" @click="fileInputRef?.click()">
          <Paperclip :size="16" />
        </button>
        <button type="button" class="ticket-chat__icon-btn" :title="t('ticketCard.recordVoice')" @click="startRecording">
          <Mic :size="16" />
        </button>
        <BaseSelect
          v-model="selectedTemplate"
          class="ticket-chat__template"
          :options="templateOptions"
          @update:model-value="onTemplateChange"
        />
        <div class="ticket-chat__toolbar-spacer" />
        <BaseButton
          type="button"
          variant="secondary"
          size="sm"
          :disabled="!draft.trim() || !canLeaveNotes"
          :title="!canLeaveNotes ? t('ticketCard.noNoteRights') : ''"
          @click="onAddNote"
        >
          <StickyNote :size="14" />{{ t('ticketCard.addNote') }}
        </BaseButton>
        <BaseButton type="submit" size="sm" :disabled="(!draft.trim() && !pendingAttachments.length) || !canReply">
          <Send :size="14" />{{ t('ticketCard.send') }}
        </BaseButton>
      </div>
    </form>

    <PersonInfoModal v-model="personModalOpen" :person-type="personType" :person-id="personId" />
    <ImageLightbox :src="lightboxUrl" @close="lightboxUrl = null" />
  </div>
</template>

<script setup lang="ts">
import { Download, Mic, Paperclip, Pause, Play, Send, StickyNote, X } from '@lucide/vue'
import type { MessageAttachment, TicketMessage, TicketNote } from '~/types'

const props = defineProps<{ ticketId: number }>()

const { t, locale } = useI18n()
const { getTicket, messagesFor, notesFor, addMessage, addNote } = useTickets()
const { getClient } = useClients()
const { getEmployee } = useEmployees()
const { templates } = useTemplates()
const { currentEmployee, currentEmployeeId } = useAuth()

const ticket = computed(() => getTicket(props.ticketId))
const client = computed(() => (ticket.value ? getClient(ticket.value.clientId) : undefined))

const messages = messagesFor(props.ticketId)
const notes = notesFor(props.ticketId)

type TimelineItem = { kind: 'message'; data: TicketMessage } | { kind: 'note'; data: TicketNote }

const timeline = computed<TimelineItem[]>(() =>
  [
    ...messages.value.map((data) => ({ kind: 'message' as const, data })),
    ...notes.value.map((data) => ({ kind: 'note' as const, data }))
  ].sort((a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime())
)

function authorLabel(message: TicketMessage): string {
  if (message.author === 'client') return client.value?.fullName ?? message.authorName
  return (message.authorId ? getEmployee(message.authorId)?.fullName : undefined) ?? message.authorName
}

const canReply = computed(() => currentEmployee.value?.canReply ?? true)
const canLeaveNotes = computed(() => currentEmployee.value?.canLeaveNotes ?? false)

const draft = ref('')
const selectedTemplate = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const pendingAttachments = ref<MessageAttachment[]>([])
let pendingAttachmentId = 0

const templateOptions = computed(() => [
  { value: '', label: t('ticketCard.chooseTemplate') },
  ...templates.value.map((template) => ({ value: String(template.id), label: template.name }))
])

function onTemplateChange(value: string) {
  const template = templates.value.find((item) => String(item.id) === value)
  if (template) draft.value = template.content
}

function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  for (const file of files) {
    const isImage = file.type.startsWith('image/')
    pendingAttachments.value.push({
      id: --pendingAttachmentId,
      kind: isImage ? 'image' : 'file',
      name: file.name,
      url: URL.createObjectURL(file)
    })
  }
  input.value = ''
}

function removePending(id: number) {
  pendingAttachments.value = pendingAttachments.value.filter((item) => item.id !== id)
}

const isRecording = ref(false)
const recordingSeconds = ref(0)
let recordingInterval: ReturnType<typeof setInterval> | null = null

function startRecording() {
  isRecording.value = true
  recordingSeconds.value = 0
  recordingInterval = setInterval(() => {
    recordingSeconds.value++
  }, 1000)
}

function stopRecording() {
  if (recordingInterval) clearInterval(recordingInterval)
  recordingInterval = null
  isRecording.value = false
  if (recordingSeconds.value > 0) {
    pendingAttachments.value.push({ id: --pendingAttachmentId, kind: 'voice', name: t('ticketCard.voiceMessage'), durationSec: recordingSeconds.value })
  }
  recordingSeconds.value = 0
}

function cancelRecording() {
  if (recordingInterval) clearInterval(recordingInterval)
  recordingInterval = null
  isRecording.value = false
  recordingSeconds.value = 0
}

onBeforeUnmount(() => {
  if (recordingInterval) clearInterval(recordingInterval)
  stopActiveAudio()
})

function onSend() {
  if (!draft.value.trim() && !pendingAttachments.value.length) return
  addMessage(props.ticketId, draft.value.trim(), currentEmployee.value?.fullName ?? t('ticketCard.you'), currentEmployeeId.value, pendingAttachments.value)
  draft.value = ''
  pendingAttachments.value = []
  selectedTemplate.value = ''
}

function onAddNote() {
  if (!draft.value.trim()) return
  addNote(props.ticketId, draft.value.trim(), currentEmployee.value?.fullName ?? t('ticketCard.you'), currentEmployeeId.value)
  draft.value = ''
  selectedTemplate.value = ''
}

const personModalOpen = ref(false)
const personType = ref<'employee' | 'client' | null>(null)
const personId = ref<number | null>(null)

function openPerson(type: 'employee' | 'client', id: number | null | undefined) {
  if (id == null) return
  personType.value = type
  personId.value = id
  personModalOpen.value = true
}

const lightboxUrl = ref<string | null>(null)

function openLightbox(url: string | undefined) {
  if (url) lightboxUrl.value = url
}

// Voice messages have no real recorded audio in this prototype, so playback
// synthesizes an audible tone for the message's own duration via the Web Audio
// API — enough to confirm the play/pause controls actually produce sound,
// without requiring a backend or a bundled audio asset.
const playingId = ref<number | null>(null)
let audioCtx: AudioContext | null = null
let activeAudio: { oscillator: OscillatorNode; lfo: OscillatorNode; gain: GainNode; timeoutId: number } | null = null

function stopActiveAudio() {
  if (activeAudio && audioCtx) {
    const { oscillator, lfo, gain, timeoutId } = activeAudio
    window.clearTimeout(timeoutId)
    const now = audioCtx.currentTime
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(0, now + 0.05)
    oscillator.stop(now + 0.06)
    lfo.stop(now + 0.06)
    activeAudio = null
  }
  playingId.value = null
}

function togglePlay(attachment: MessageAttachment) {
  if (playingId.value === attachment.id) {
    stopActiveAudio()
    return
  }
  stopActiveAudio()
  if (!audioCtx) audioCtx = new AudioContext()
  const ctx = audioCtx
  if (ctx.state === 'suspended') ctx.resume()

  const oscillator = ctx.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.value = 330

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 4.5
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 6
  lfo.connect(lfoGain)
  lfoGain.connect(oscillator.frequency)

  const gain = ctx.createGain()
  gain.gain.value = 0
  oscillator.connect(gain)
  gain.connect(ctx.destination)

  const duration = Math.max(0.5, attachment.durationSec ?? 3)
  const now = ctx.currentTime
  gain.gain.linearRampToValueAtTime(0.08, now + 0.05)
  gain.gain.setValueAtTime(0.08, Math.max(now + 0.05, now + duration - 0.1))
  gain.gain.linearRampToValueAtTime(0, now + duration)

  oscillator.start(now)
  lfo.start(now)
  oscillator.stop(now + duration)
  lfo.stop(now + duration)

  const timeoutId = window.setTimeout(() => {
    if (playingId.value === attachment.id) playingId.value = null
    activeAudio = null
  }, duration * 1000)

  activeAudio = { oscillator, lfo, gain, timeoutId }
  playingId.value = attachment.id
}

function waveBars(id: number) {
  const heights = [6, 12, 18, 10, 16, 22, 8, 14, 20, 12, 9, 17, 11, 19, 7, 15, 13, 21, 9, 12]
  return heights.map((h, i) => ({ i, h: 4 + ((h + id) % 20) }))
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(locale.value, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const scrollEl = ref<HTMLElement | null>(null)
watch(
  () => timeline.value.length,
  async () => {
    await nextTick()
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  },
  { immediate: true }
)
</script>

<style scoped>
.ticket-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 420px;
}

.ticket-chat__messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 4px;
  max-height: 60vh;
}

.ticket-chat__message {
  display: flex;
  gap: 8px;
  max-width: 80%;
}

.ticket-chat__message--employee {
  flex-direction: row-reverse;
  margin-left: auto;
}

.ticket-chat__avatar-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
}

.ticket-chat__bubble {
  background: var(--color-surface-alt);
  border-radius: 10px;
  padding: 8px 12px;
  min-width: 0;
}

.ticket-chat__message--employee .ticket-chat__bubble {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}

.ticket-chat__bubble-header {
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 2px;
}

.ticket-chat__author-btn {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  color: inherit;
  cursor: pointer;
}

.ticket-chat__author-btn:hover {
  text-decoration: underline;
}

.ticket-chat__time {
  font-size: 11px;
  opacity: 0.7;
}

.ticket-chat__text {
  margin: 0;
  font-size: 13px;
  white-space: pre-wrap;
}

.ticket-chat__attachments {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ticket-chat__attachment {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  opacity: 0.85;
  color: inherit;
  text-decoration: none;
}

.ticket-chat__attachment--link {
  cursor: pointer;
  opacity: 1;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ticket-chat__attachment-download {
  opacity: 0.75;
}

.ticket-chat__image-btn {
  display: block;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
  border-radius: 8px;
  overflow: hidden;
}

.ticket-chat__image {
  max-width: 220px;
  max-height: 160px;
  border-radius: 8px;
  display: block;
  object-fit: cover;
  transition: opacity 0.15s ease;
}

.ticket-chat__image-btn:hover .ticket-chat__image {
  opacity: 0.88;
}

.ticket-chat__voice {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 999px;
  padding: 6px 10px;
  min-width: 180px;
}

.ticket-chat__voice-play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  cursor: pointer;
  flex-shrink: 0;
}

.ticket-chat__voice-wave {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  height: 22px;
}

.ticket-chat__voice-bar {
  width: 2px;
  background: currentColor;
  opacity: 0.6;
  border-radius: 1px;
}

.ticket-chat__voice-duration {
  font-size: 11px;
  opacity: 0.8;
  flex-shrink: 0;
}

.ticket-chat__note {
  display: flex;
  gap: 8px;
  align-self: center;
  max-width: 92%;
  background: var(--color-warning-bg);
  border: 1px dashed var(--color-warning);
  border-radius: 10px;
  padding: 8px 12px;
  color: var(--color-text);
}

.ticket-chat__note-body {
  min-width: 0;
}

.ticket-chat__note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.ticket-chat__note-tag {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-warning);
  font-weight: 700;
}

.ticket-chat__composer {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ticket-chat__pending {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ticket-chat__pending-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 4px 8px 4px 4px;
}

.ticket-chat__pending-thumb {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: cover;
}

.ticket-chat__pending-remove {
  display: inline-flex;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0;
}

.ticket-chat__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ticket-chat__toolbar-spacer {
  flex: 1;
}

.ticket-chat__template {
  width: 200px;
}

.ticket-chat__template :deep(.base-select__trigger) {
  height: 36px;
}

.ticket-chat__file-input {
  display: none;
}

.ticket-chat__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
}

.ticket-chat__icon-btn:hover {
  color: var(--color-text);
  border-color: var(--color-accent);
}

.ticket-chat__recording {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 4px;
}

.ticket-chat__recording-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-danger);
  flex-shrink: 0;
  animation: ticket-chat-pulse 1.2s ease-in-out infinite;
}

@keyframes ticket-chat-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

.ticket-chat__recording-label {
  font-size: 13px;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.ticket-chat__recording-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

@media (max-width: 640px) {
  .ticket-chat__toolbar {
    justify-content: flex-end;
  }

  .ticket-chat__template {
    order: 1;
    width: 100%;
  }

  .ticket-chat__toolbar-spacer {
    display: none;
  }
}
</style>
