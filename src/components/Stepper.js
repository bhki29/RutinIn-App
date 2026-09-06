import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, radius } from "../theme";

export default function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  backgroundColor = colors.surfaceMuted,
}) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={decrease}
        accessibilityLabel="Kurangi"
      >
        <Ionicons name="remove" size={18} color={colors.text.primary} />
      </TouchableOpacity>

      <View style={styles.valueWrapper}>
        <Text style={[typography.numberMedium, { color: colors.text.primary }]}>
          {value}
        </Text>
        {label ? (
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            {label}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={increase}
        accessibilityLabel="Tambah"
      >
        <Ionicons name="add" size={18} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxl,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  valueWrapper: {
    alignItems: "center",
    minWidth: 64,
  },
});
