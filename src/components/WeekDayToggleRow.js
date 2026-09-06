import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, radius } from "../theme";
import { toISODate, dayLabel, dayIndexOf } from "../utils/dateUtils";

export default function WeekDayToggleRow({
  weekDates,
  checkInSet,
  isScheduled,
  activeColor = colors.brand.green,
  onToggleDate,
  disabled = false,
}) {
  const todayISOValue = toISODate(new Date());

  return (
    <View style={styles.row}>
      {weekDates.map((date) => {
        const dateISO = toISODate(date);
        const scheduled = isScheduled(date);
        const isChecked = checkInSet.has(dateISO);
        const isFuture = dateISO > todayISOValue;
        const isCellDisabled = disabled || isFuture;

        return (
          <View key={dateISO} style={styles.column}>
            <Text
              style={[
                typography.label,
                styles.dayLabel,
                { color: colors.text.secondary },
              ]}
            >
              {dayLabel(dayIndexOf(date))}
            </Text>

            <TouchableOpacity
              style={[
                styles.circle,
                isChecked
                  ? { backgroundColor: activeColor }
                  : scheduled
                    ? { borderWidth: 1, borderColor: colors.border }
                    : {
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderStyle: "dashed",
                        opacity: 0.5,
                      },
                isFuture && styles.circleFuture,
              ]}
              onPress={() => onToggleDate(dateISO)}
              disabled={isCellDisabled}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: isChecked,
                disabled: isCellDisabled,
              }}
            >
              {isChecked ? (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={colors.text.onBrand}
                />
              ) : null}
            </TouchableOpacity>

            <Text
              style={[
                typography.caption,
                styles.dateLabel,
                { color: colors.text.muted },
              ]}
            >
              {date.getDate()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  column: {
    alignItems: "center",
    gap: 4,
  },
  dayLabel: {
    textTransform: "uppercase",
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  circleFuture: {
    opacity: 0.4,
  },
  dateLabel: {
    fontSize: 10,
  },
});
