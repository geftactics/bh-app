/**
 * Returns array of festival days that should be collapsed by default
 * based on the current day of the week
 * @returns Array of day names to collapse
 */
export function getCollapsedDaysForToday(): string[] {
  const today = new Date().getDay();

  const DAYS = {
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
    MONDAY: 1,
  } as const;

  switch (today) {
    case DAYS.FRIDAY:
      return ['Thursday'];
    case DAYS.SATURDAY:
      return ['Thursday', 'Friday'];
    case DAYS.SUNDAY:
      return ['Thursday', 'Friday', 'Saturday'];
    case DAYS.MONDAY:
      return ['Thursday', 'Friday', 'Saturday', 'Sunday'];
    default:
      return [];
  }
}
