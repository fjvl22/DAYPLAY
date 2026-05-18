export interface SystemEvent {
  id: number;
  eventType: string;
  description: string;
  category: string;
  userId?: number;
  adminId?: number;
  ipAddress?: string;
  createdAt: string;
}