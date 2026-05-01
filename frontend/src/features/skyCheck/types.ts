export type SkyCheckStatusResponse = {
  checkedToday: boolean;
  streakDays: number;
  lastCheckedDate?: string | null;
};
