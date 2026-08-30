export type ServiceType = 
  | 'Estrategia Empresarial'
  | 'Transformación Digital'
  | 'Eficiencia Operativa'
  | 'Auditoría & Compliance'
  | 'Consultoría Financiera'
  | 'Talento & RRHH'
  | 'Innovación & Producto';

export type PricingModel = 'retainer' | 'project' | 'hourly';

export type StageId = 'lead' | 'diagnostico' | 'propuesta' | 'negociacion' | 'ganado' | 'perdido';

export interface Stage {
  id: StageId;
  name: string;
  color: string;
  bgLight: string;
  borderLight: string;
  defaultProbability: number;
  description: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  value: number;
  currency: string;
  pricingModel: PricingModel;
  serviceType: ServiceType;
  stage: StageId;
  probability: number;
  expectedCloseDate: string; // YYYY-MM-DD
  consultant: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'lead' | 'activo' | 'inactivo' | 'cliente';
  avatar?: string;
  notes: string;
  industry: string;
  tags: string[];
  lastContactDate?: string;
  nextMeetingDate?: string;
  createdAt: string;
}

export type MeetingType = 
  | 'discovery'
  | 'diagnostico'
  | 'presentacion_propuesta'
  | 'revision_alcance'
  | 'seguimiento_proyecto';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  contactId: string;
  contactName: string;
  contactEmail: string;
  dealId?: string;
  dealTitle?: string;
  meetLink?: string;
  location?: string;
  status: 'programada' | 'completada' | 'cancelada';
  type: MeetingType;
  syncedWithGoogle: boolean;
  googleEventId?: string;
  consultant: string;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  contactId: string;
  contactName: string;
  toEmail: string;
  subject: string;
  body: string;
  templateUsed?: string;
  sentAt: string;
  status: 'enviado' | 'borrador' | 'fallido';
  syncedWithGmail: boolean;
  gmailMessageId?: string;
}

export interface Activity {
  id: string;
  type: 'email' | 'meeting' | 'deal_change' | 'note' | 'contact_created' | 'deal_created';
  description: string;
  timestamp: string;
  contactId?: string;
  dealId?: string;
  metadata?: Record<string, any>;
}

export interface GoogleAuthState {
  isConnected: boolean;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  accessToken?: string;
  expiresAt?: number;
  lastSyncTime?: string;
  isSyncing: boolean;
  autoSyncEnabled: boolean;
  syncFrequencySeconds: number;
}
