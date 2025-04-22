export enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export const DayOfWeekLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.Sunday]: 'Chủ nhật',
  [DayOfWeek.Monday]: 'Thứ hai',
  [DayOfWeek.Tuesday]: 'Thứ ba',
  [DayOfWeek.Wednesday]: 'Thứ tư',
  [DayOfWeek.Thursday]: 'Thứ năm',
  [DayOfWeek.Friday]: 'Thứ sáu',
  [DayOfWeek.Saturday]: 'Thứ bảy',
};
