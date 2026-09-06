import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { colors, typography, spacing, radius } from "../theme";
import {
  getHabitsWithStats,
  toggleCheckIn,
  recalculateStreaks,
} from "../db/habitsRepository";
import { isDayScheduled, getRepeatLabel } from "../utils/streakUtils";
import { toISODate, getWeekDates, getMonthYearLabel } from "../utils/dateUtils";
import { getHabitSubtitle } from "../utils/habitFormat";

import ProgressBar from "../components/ProgressBar";
import HabitCard from "../components/HabitCard";
import WeekDayToggleRow from "../components/WeekDayToggleRow";

function getWeeklyTarget(habit, weekDates) {
  if (habit.repeatType === "x_per_week") {
    return habit.repeatTarget || 1;
  }
  return weekDates.filter((date) => isDayScheduled(habit, date)).length;
}

function getWeeklyCompleted(habit, weekDates) {
  return weekDates.filter((date) => habit.checkInSet.has(toISODate(date)))
    .length;
}

export default function WeeklyScreen() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingKey, setTogglingKey] = useState(null);

  const loadHabits = useCallback(async () => {
    try {
      const data = await getHabitsWithStats();
      setHabits(data);
    } catch (err) {
      console.error("Gagal memuat habit:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  const weekDates = useMemo(() => getWeekDates(new Date(), 1), []);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[weekDates.length - 1];

  const weekRangeLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${getMonthYearLabel(weekStart)}`
      : `${getMonthYearLabel(weekStart)} - ${getMonthYearLabel(weekEnd)}`;

  const summary = useMemo(() => {
    let totalTarget = 0;
    let totalCompleted = 0;
    let milestonesCompleted = 0;

    habits.forEach((habit) => {
      const target = getWeeklyTarget(habit, weekDates);
      const completed = getWeeklyCompleted(habit, weekDates);

      totalTarget += target;
      totalCompleted += Math.min(completed, target);

      if (target > 0 && completed >= target) {
        milestonesCompleted += 1;
      }
    });

    const percent =
      totalTarget === 0 ? 0 : Math.round((totalCompleted / totalTarget) * 100);

    return {
      percent,
      milestonesCompleted,
      milestonesTotal: habits.length,
    };
  }, [habits, weekDates]);

  async function handleToggleDate(habitId, dateISO) {
    const key = `${habitId}-${dateISO}`;
    if (togglingKey) return;

    setTogglingKey(key);
    try {
      await toggleCheckIn(habitId, dateISO);
      await recalculateStreaks(habitId);
      await loadHabits();
    } catch (err) {
      console.error("Gagal update check-in:", err);
    } finally {
      setTogglingKey(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.green} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Ringkasan mingguan */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <View style={styles.summaryText}>
            <Text
              style={[typography.numberLarge, { color: colors.text.primary }]}
            >
              {summary.percent}%
            </Text>
            <Text
              style={[
                typography.body,
                { color: colors.text.secondary, marginTop: 2 },
              ]}
            >
              {summary.milestonesCompleted} of {summary.milestonesTotal} weekly
              milestones completed
            </Text>
          </View>

          <View style={styles.summaryIconCircle}>
            <Ionicons name="trending-up" size={26} color={colors.brand.green} />
          </View>
        </View>

        <ProgressBar
          progress={summary.percent}
          color={colors.brand.green}
          trackColor={colors.surface}
        />
      </View>

      {/* Label rentang minggu */}
      <Text
        style={[
          typography.h3,
          styles.weekLabel,
          { color: colors.text.primary },
        ]}
      >
        {weekRangeLabel}
      </Text>

      {/* List habit */}
      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text
            style={[
              typography.body,
              { color: colors.text.secondary, textAlign: "center" },
            ]}
          >
            Belum ada habit. Tekan tombol + untuk membuat habit pertamamu.
          </Text>
        </View>
      ) : (
        habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            subtitle={getHabitSubtitle(habit)}
            metaText={getRepeatLabel(habit)}
            streak={habit.currentStreak}
          >
            <WeekDayToggleRow
              weekDates={weekDates}
              checkInSet={habit.checkInSet}
              isScheduled={(date) => isDayScheduled(habit, date)}
              activeColor={habit.color}
              disabled={!!togglingKey}
              onToggleDate={(dateISO) => handleToggleDate(habit.id, dateISO)}
            />
          </HabitCard>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    backgroundColor: colors.pastel.mintSoft,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  summaryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.white,
    alignItems: "center",
    justifyContent: "center",
  },
  weekLabel: {
    marginBottom: spacing.md,
  },
  emptyState: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
});
