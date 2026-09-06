import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../theme";
import { toISODate, addDays, dayIndexOf } from "../utils/dateUtils";
import { isDayScheduled } from "../utils/streakUtils";

const CELL_GAP = 3;
const WEEKS_TO_SHOW = 13;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ContributionHeatmap({ habit, checkInSet }) {
  const [containerWidth, setContainerWidth] = useState(0);

  const today = new Date();
  const todayISOValue = toISODate(today);
  const createdISO = toISODate(new Date(habit.createdAt));

  const todayDow = dayIndexOf(today); // 0=Minggu..6=Sabtu
  const diffToMonday = (todayDow + 6) % 7;
  const currentWeekMonday = addDays(today, -diffToMonday);
  const firstMonday = addDays(currentWeekMonday, -(WEEKS_TO_SHOW - 1) * 7);

  const weeks = Array.from({ length: WEEKS_TO_SHOW }, (_, w) => {
    const weekStart = addDays(firstMonday, w * 7);
    return Array.from({ length: 7 }, (_, d) => addDays(weekStart, d));
  });

  const cellSize =
    containerWidth > 0
      ? Math.max(
          10,
          Math.floor(
            (containerWidth - (WEEKS_TO_SHOW - 1) * CELL_GAP) / WEEKS_TO_SHOW,
          ),
        )
      : 16;

  function getCellColor(date) {
    const dISO = toISODate(date);

    if (checkInSet.has(dISO)) return habit.color;

    if (dISO > todayISOValue) return colors.heatmap.empty;
    if (dISO < createdISO) return colors.heatmap.empty;
    if (!isDayScheduled(habit, date)) return colors.heatmap.empty;
    return colors.heatmap.scheduledMissed;
  }

  return (
    <View style={styles.wrapper}>
      <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        <View style={styles.monthRow}>
          {weeks.map((week, i) => {
            const monday = week[0];
            const isFirstColumn = i === 0;
            const isNewMonth = monday.getDate() <= 7;
            const showLabel = isFirstColumn || isNewMonth;

            return (
              <View key={i} style={{ width: cellSize }}>
                {showLabel ? (
                  <Text
                    numberOfLines={1}
                    style={[typography.caption, { color: colors.text.muted }]}
                  >
                    {MONTH_LABELS[monday.getMonth()]}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>

        {/* Grid: kolom minggu x baris 7 hari. */}
        <View style={styles.grid}>
          {weeks.map((week, wIdx) => (
            <View key={wIdx} style={{ gap: CELL_GAP }}>
              {week.map((date) => (
                <View
                  key={toISODate(date)}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getCellColor(date),
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Legenda */}
      <View style={styles.legendRow}>
        <Text style={[typography.caption, { color: colors.text.muted }]}>
          Low
        </Text>
        <View
          style={[
            styles.legendSwatch,
            { backgroundColor: colors.heatmap.empty },
          ]}
        />
        <View style={[styles.legendSwatch, { backgroundColor: habit.color }]} />
        <Text style={[typography.caption, { color: colors.text.muted }]}>
          High
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.md,
    marginHorizontal: spacing.xs,
  },
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  cell: {
    borderRadius: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: spacing.sm,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
