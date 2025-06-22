export function getCollapsedDaysForToday(): string[] {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  switch (today) {
    case 5: // Friday
      return ['Thursday'];
    case 6: // Saturday
      return ['Thursday', 'Friday'];
    case 0: // Sunday
      return ['Thursday', 'Friday', 'Saturday'];
    case 1: // Monday
      return ['Thursday', 'Friday', 'Saturday', 'Sunday'];
    default: // Tuesday, Wednesday, Thursday
      return [];
  }
}
