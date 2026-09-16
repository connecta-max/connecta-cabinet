export type ClientType = 'free' | 'paid' | 'vip'
export type TicketStatus = 'new' | 'in_progress' | 'closed'
export type EmployeeRole = 'admin' | 'support'

export interface Client {
  id: number
  fullName: string
  email: string
  phone: string
  type: ClientType
}

export type AttachmentKind = 'image' | 'voice' | 'file'

export interface MessageAttachment {
  id: number
  kind: AttachmentKind
  name: string
  url?: string
  durationSec?: number
}

export interface TicketMessage {
  id: number
  ticketId: number
  author: 'client' | 'employee'
  authorName: string
  authorId: number | null
  text: string
  attachments: MessageAttachment[]
  createdAt: string
}

export interface TicketNote {
  id: number
  ticketId: number
  authorName: string
  authorId: number | null
  text: string
  createdAt: string
}

export interface Ticket {
  id: number
  clientId: number
  status: TicketStatus
  assigneeId: number | null
  tags: string[]
  createdAt: string
  updatedAt: string
  slaDeadline: string
  csat: number | null
}

export interface Employee {
  id: number
  fullName: string
  login: string
  email: string
  role: EmployeeRole
  active: boolean
  canReply: boolean
  canLeaveNotes: boolean
}

export interface Penalty {
  id: number
  employeeId: number
  amount: number
  reason: string
  issuedBy: string
  ticketId: number | null
  createdAt: string
}

export interface ResponseTemplate {
  id: number
  name: string
  content: string
}

export interface SlaThresholds {
  vip: number
  paid: number
  free: number
}
