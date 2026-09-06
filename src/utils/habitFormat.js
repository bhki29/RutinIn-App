export function getHabitSubtitle(habit) {
  const parts = [];
  if (habit.description) parts.push(habit.description);
  if (habit.durationMinutes) parts.push(`${habit.durationMinutes} Minutes`);
  return parts.join(" • ");
}
