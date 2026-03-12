export interface Chapter {
    id: number;
    storyId: number;
    dayNumber: number;
    title: string;
    content: string;
    unlockCondition?: string;
  }