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
  [DayOfWeek.Monday]: 'Thứ 2',
  [DayOfWeek.Tuesday]: 'Thứ 3',
  [DayOfWeek.Wednesday]: 'Thứ 4',
  [DayOfWeek.Thursday]: 'Thứ 5',
  [DayOfWeek.Friday]: 'Thứ 6',
  [DayOfWeek.Saturday]: 'Thứ 7',
};
