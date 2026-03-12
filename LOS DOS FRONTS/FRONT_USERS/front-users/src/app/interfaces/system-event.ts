export interface SystemEvent {
    id: number;
    adminId?: number;
    userId?: number;
    eventType: string;
    description?: string;
    category: 'ADMIN' | 'USER' | 'SYSTEM';
    eventDate: string;
    ipAddress?: string;
  }