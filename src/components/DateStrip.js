import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, typography, spacing, radius } from "../theme";
import {
  toISODate,
  dayLabel,
  dayIndexOf,
  getWeekDates,
} from "../utils/dateUtils";

export default function DateStrip({ selectedDateISO, onSelectDate }) {
  const [y, m, d] = selectedDateISO.split("-").map(Number);
  const selectedDate = new Date(y, m - 1, d);
  const weekDates = getWeekDates(selectedDate, 1);

  const todayISOValue = toISODate(new Date());

  return (
    <View style={styles.row}>
      {weekDates.map((date) => {
        const dateISO = toISODate(date);
        const isSelected = dateISO === selectedDateISO;
        const isFuture = dateISO > todayISOValue;

        return (
          <TouchableOpacity
            key={dateISO}
            style={[
              styles.cell,
              isSelected && styles.cellActive,
              isFuture && styles.cellDisabled,
            ]}
            disabled={isFuture}
            onPress={() => onSelectDate(dateISO)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled: isFuture }}
          >
            <Text
              style={[
                typography.caption,
                {
                  color: isSelected ? colors.text.onBrand : colors.text.muted,
                },
              ]}
            >
              {dayLabel(dayIndexOf(date))}
            </Text>
            <Text
              style={[
                typography.bodyMedium,
                {
                  color: isSelected
                    ? colors.text.onBrand
                    : isFuture
                      ? colors.text.muted
                      : colors.text.primary,
                },
              ]}
            >
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  cell: {
    width: 45,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  cellActive: {
    backgroundColor: colors.text.primary,
  },
  cellDisabled: {
    opacity: 0.5,
  },
});
