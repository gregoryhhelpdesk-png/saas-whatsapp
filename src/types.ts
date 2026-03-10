
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'canceled' | 'partial';

export interface Client {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  lastService?: string;
  totalAppointments: number;
}

export interface Professional {
  id: string;
  tenantId: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  availability: {
    days: number[]; // 0-6
    start: string;
    end: string;
    intervals: { start: string; end: string }[];
  };
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  requiresDeposit: boolean;
  depositAmount?: number;
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  tenantId: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: AppointmentStatus;
  origin: 'whatsapp' | 'manual';
  paymentStatus: PaymentStatus;
}

export interface Transaction {
  id: string;
  tenantId: string;
  clientId: string;
  serviceId: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  paymentMethod?: string;
  reference?: string;
}

export interface Automation {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  enabled: boolean;
  template: string;
  triggerTime: string; // e.g., "24h_before"
  status: 'active' | 'inactive';
}

export interface Log {
  id: string;
  tenantId: string;
  timestamp: string;
  event: string;
  type: 'info' | 'success' | 'warning' | 'error';
  details: string;
  client?: string;
}

export interface WhatsAppInstance {
  tenantId: string;
  name: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  number?: string;
  lastUpdate: string;
  provider: string;
}

export type ConversationStatus = 'new' | 'unread' | 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';

export interface Message {
  id: string;
  tenantId: string;
  conversationId: string;
  senderId?: string; // If empty, it's from the customer
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  fromMe: boolean;
}

export interface Conversation {
  id: string;
  tenantId: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  status: ConversationStatus;
  unreadCount: number;
  attendantName?: string;
  origin: string;
}

export type UserRole = 'super_admin' | 'platform_admin' | 'tenant_owner' | 'tenant_admin' | 'tenant_attendant';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  tenantId?: string;
  status: 'active' | 'inactive' | 'blocked';
  lastAccess?: string;
  avatar?: string;
  scope: 'platform' | 'tenant';
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  planId: string;
  status: 'active' | 'suspended' | 'trial' | 'overdue' | 'canceled' | 'blocked';
  trial: boolean;
  expiresAt: string;
  whatsappConnected: boolean;
  totalUsers: number;
  isTrusted?: boolean;
  createdAt: string;
}

export interface TenantSettings {
  tenantId: string;
  companyName: string;
  logo?: string;
  phone: string;
  email: string;
  address: string;
  cancellationPolicy: string;
  businessHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  whatsappConfig: {
    instanceName: string;
    autoReply: boolean;
    welcomeMessage: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  cycle: 'monthly' | 'yearly';
  limits: {
    users: number;
    instances: number;
    messages: number;
  };
  features: {
    inbox: boolean;
    automations: boolean;
    reports: boolean;
    api?: boolean;
  };
  status: 'active' | 'inactive';
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  amount: number;
  status: 'active' | 'trial' | 'overdue' | 'suspended' | 'canceled';
  cycle: 'monthly' | 'yearly';
  nextBilling: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  daysOverdue: number;
  autoBlockEnabled: boolean;
}

export interface PlatformInvoice {
  id: string;
  tenantId: string;
  subscriptionId: string;
  referenceMonth: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  status: 'paid' | 'pending' | 'overdue' | 'canceled';
  daysOverdue: number;
  paymentLink?: string;
}

export interface PlatformBillingLog {
  id: string;
  tenantId: string;
  invoiceId: string;
  actionType: 'reminder' | 'overdue_notice' | 'block_notice' | 'manual_block' | 'manual_unblock' | 'exception_applied';
  channel: 'email' | 'whatsapp' | 'system';
  sentAt: string;
  status: 'success' | 'failed';
  notes?: string;
}

export interface PlatformRule {
  id: string;
  name: string;
  reminderBeforeDays: number;
  blockAfterDays: number;
  suspendAfterDays: number;
  trustExceptionEnabled: boolean;
  active: boolean;
}

export interface GlobalLog extends Omit<Log, 'tenantId'> {
  tenantId?: string;
  userId?: string;
  integration?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  tenantId?: string;
  timestamp: string;
  ip: string;
  result: 'success' | 'failure';
}

export interface Integration {
  id: string;
  name: string;
  type: 'whatsapp' | 'payment' | 'storage' | 'ai';
  status: 'online' | 'offline' | 'degraded';
  lastCheck: string;
  latency?: number;
}

export interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  overdueTenants: number;
  totalUsers: number;
  totalWhatsAppInstances: number;
  connectedInstances: number;
  totalMessages: number;
  totalAppointments: number;
  mrr: number;
  churnRate: number;
}
