import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, radius, shadow } from "../theme";
import IconView from "./Icon";
import StreakBadge from "./StreakBadge";
import { getHabitIcon } from "../constants/habitOptions";

export default function HabitCard({
  habit,
  subtitle,
  metaText,
  streak,
  rightSlot,
  children,
}) {
  const iconMeta = getHabitIcon(habit.icon);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View
          style={[styles.iconCircle, { backgroundColor: `${habit.color}26` }]}
        >
          <IconView
            family={iconMeta.family}
            name={iconMeta.name}
            size={20}
            color={habit.color}
          />
        </View>

        <View style={styles.textBlock}>
          <View style={styles.nameRow}>
            <Text
              style={[
                typography.h3,
                styles.nameText,
                { color: colors.text.primary },
              ]}
              numberOfLines={1}
            >
              {habit.name}
            </Text>
            <StreakBadge streak={streak} size="sm" />
          </View>
          {subtitle ? (
            <Text
              style={[typography.body, { color: colors.text.secondary }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
          {metaText ? (
            <Text
              style={[
                typography.label,
                styles.metaText,
                { color: colors.text.muted },
              ]}
              numberOfLines={1}
            >
              {metaText}
            </Text>
          ) : null}
        </View>

        {rightSlot}
      </View>

      {children}
    </View>
  );
}

export function HabitCheckbox({ checked, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      {checked ? (
        <Ionicons name="checkmark" size={20} color={colors.text.onBrand} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 2,
  },
  nameText: {
    flexShrink: 1,
  },
  metaText: {
    marginTop: 2,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.brand.green,
    borderColor: colors.brand.green,
  },
  checkboxDisabled: {
    opacity: 0.4,
  },
});
