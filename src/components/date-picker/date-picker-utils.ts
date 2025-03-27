export const months: Array<{ value: number; label: string }> = [
  { value: 0, label: 'Tháng 1' },
  { value: 1, label: 'Tháng 2' },
  { value: 2, label: 'Tháng 3' },
  { value: 3, label: 'Tháng 4' },
  { value: 4, label: 'Tháng 5' },
  { value: 5, label: 'Tháng 6' },
  { value: 6, label: 'Tháng 7' },
  { value: 7, label: 'Tháng 8' },
  { value: 8, label: 'Tháng 9' },
  { value: 9, label: 'Tháng 10' },
  { value: 10, label: 'Tháng 11' },
  { value: 11, label: 'Tháng 12' }
];

// Create an array of years from 10 years ago to 10 years later
export const currentYear: number = new Date().getFullYear();
export const years: number[] = Array.from(
  { length: 21 },
  (_, i) => currentYear - 10 + i
);

export const hours: number[] = Array.from({ length: 24 }, (_, i) => i);

export const minutes: number[] = Array.from({ length: 12 }, (_, i) => i * 5);
