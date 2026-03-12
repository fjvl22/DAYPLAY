export interface StoryAccess {
    id: number;
    storyId: number;
    userId: number;
    grantedBy: number;
    accessGranted: boolean;
    grantDate: string;
    revokeDate?: string;
    notes?: string;
  }