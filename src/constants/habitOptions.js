export const HABIT_ICONS = [
  { id: "run", name: "run", family: "MaterialCommunityIcons" },
  { id: "dumbbell", name: "dumbbell", family: "MaterialCommunityIcons" },
  { id: "meditation", name: "meditation", family: "MaterialCommunityIcons" },
  { id: "code", name: "code-tags", family: "MaterialCommunityIcons" },
  { id: "book", name: "book-open-variant", family: "MaterialCommunityIcons" },
  { id: "water", name: "cup-water", family: "MaterialCommunityIcons" },
  { id: "sleep", name: "sleep", family: "MaterialCommunityIcons" },
  { id: "gamepad", name: "gamepad-variant", family: "MaterialCommunityIcons" },
];

export function getHabitIcon(iconId) {
  return HABIT_ICONS.find((icon) => icon.id === iconId) || HABIT_ICONS[0];
}

export default HABIT_ICONS;
