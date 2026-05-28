export interface SystemEvent {

  id: number;

  actorType: 'ADMIN' | 'USER' | 'PENDING' | 'SYSTEM';

  actorId?: number | null;

  targetType:
    | 'ADMIN'
    | 'USER'
    | 'PENDING'
    | 'GAME'
    | 'PAYMENT'
    | 'STORY'
    | 'NONE';

  targetId?: number | null;

  eventType: string;

  description: string;

  category:
    | 'AUTH'
    | 'USER_MANAGEMENT'
    | 'GAME_MANAGEMENT'
    | 'GAMEPLAY'
    | 'REWARDS'
    | 'PAYMENT'
    | 'NOTIFICATION'
    | 'SYSTEM';

  eventDate: string;

  ipAddress?: string | null;

  admin?: {
    id: number;
    person?: {
      nickname: string;
    };
  };

  appUser?: {
    id: number;
    person?: {
      nickname: string;
    };
  };
}