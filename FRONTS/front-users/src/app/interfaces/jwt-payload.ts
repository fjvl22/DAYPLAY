export interface JwtPayload {
    id: number;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'PENDING';
    nickname?: string;
    planId?: number;
    subscriptionDate?: string;
    adminType?: string;
    department?: string;
    permissions?: JSON;
}