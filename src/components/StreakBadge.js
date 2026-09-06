import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, radius } from "../theme";

export default function StreakBadge({
  streak = 0,
  unit = "Days",
  size = "md",
}) {
  const isSmall = size === "sm";

  return (
    <View style={[styles.badge, isSmall && styles.badgeSmall]}>
      <Ionicons
        name="flame"
        size={isSmall ? 11 : 13}
        color={colors.brand.orange}
      />
      <Text
        style={[typography.badge, styles.text, isSmall && styles.textSmall]}
      >
        {streak} {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.pastel.orangeSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  badgeSmall: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  text: {
    color: colors.brand.orange,
  },
  textSmall: {
    fontSize: 10,
  },
});
