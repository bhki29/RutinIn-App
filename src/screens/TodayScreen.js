import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { colors, typography, spacing, radius } from "../theme";
import {
  getHabitsWithStats,
  toggleCheckIn,
  recalculateStreaks,
} from "../db/habitsRepository";
import { isDayScheduled } from "../utils/streakUtils";
import { todayISO, getMonthYearLabel } from "../utils/dateUtils";
import { getHabitSubtitle } from "../utils/habitFormat";

import DateStrip from "../components/DateStrip";
import ProgressRing from "../components/ProgressRing";
import ProgressBar from "../components/ProgressBar";
import HabitCard, { HabitCheckbox } from "../components/HabitCard";

function toLocalDate(dateISO) {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function TodayScreen() {
  const [selectedDateISO, setSelectedDateISO] = useState(() => todayISO());
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

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

  const selectedDate = toLocalDate(selectedDateISO);
  const isFutureDate = selectedDateISO > todayISO();

  const scheduledHabits = habits.filter((habit) =>
    isDayScheduled(habit, selectedDate),
  );
  const completedCount = scheduledHabits.filter((habit) =>
    habit.checkInSet.has(selectedDateISO),
  ).length;
  const totalCount = scheduledHabits.length;
  const percent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  let summaryMessage = "No habits scheduled for this day.";
  if (totalCount > 0) {
    summaryMessage =
      percent === 100
        ? "Great job! All habits done today."
        : "Almost there! Keep your streak going.";
  }

  const remainingCount = totalCount - completedCount;
  let remainingLabel = "No habits today";
  if (totalCount > 0) {
    remainingLabel =
      remainingCount === 0
        ? "All habits done!"
        : `${remainingCount} habit remaining`;
  }

  async function handleToggle(habitId) {
    if (isFutureDate || togglingId) return;
    setTogglingId(habitId);
    try {
      await toggleCheckIn(habitId, selectedDateISO);
      await recalculateStreaks(habitId);
      await loadHabits();
    } catch (err) {
      console.error("Gagal update check-in:", err);
    } finally {
      setTogglingId(null);
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
      {/* Ringkasan harian */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <View style={styles.summaryText}>
            <Text style={[typography.h2, { color: colors.text.primary }]}>
              {completedCount} of {totalCount} completed
            </Text>
            <Text
              style={[
                typography.body,
                { color: colors.text.secondary, marginTop: 2 },
              ]}
            >
              {summaryMessage}
            </Text>
          </View>

          <ProgressRing progress={percent} size={72} strokeWidth={8}>
            <Text
              style={[
                typography.numberMedium,
                { color: colors.text.primary, fontSize: 16 },
              ]}
            >
              {percent}%
            </Text>
          </ProgressRing>
        </View>

        <View style={styles.progressBarWrapper}>
          <ProgressBar
            progress={percent}
            color={colors.brand.green}
            trackColor={colors.surface}
          />
          <View style={styles.progressLabelsRow}>
            <Text style={[typography.label, { color: colors.text.secondary }]}>
              Daily Target
            </Text>
            <Text style={[typography.label, { color: colors.text.secondary }]}>
              {remainingLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Date strip */}
      <Text
        style={[
          typography.h3,
          styles.monthLabel,
          { color: colors.text.primary },
        ]}
      >
        {getMonthYearLabel(selectedDate)}
      </Text>
      <DateStrip
        selectedDateISO={selectedDateISO}
        onSelectDate={setSelectedDateISO}
      />

      {/* List habit */}
      <Text
        style={[
          typography.h2,
          styles.sectionTitle,
          { color: colors.text.primary },
        ]}
      >
        Todays Habits
      </Text>

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
      ) : scheduledHabits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text
            style={[
              typography.body,
              { color: colors.text.secondary, textAlign: "center" },
            ]}
          >
            Tidak ada habit yang dijadwalkan pada hari ini.
          </Text>
        </View>
      ) : (
        scheduledHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            subtitle={getHabitSubtitle(habit)}
            streak={habit.currentStreak}
            rightSlot={
              <HabitCheckbox
                checked={habit.checkInSet.has(selectedDateISO)}
                onPress={() => handleToggle(habit.id)}
                disabled={isFutureDate || togglingId === habit.id}
              />
            }
          />
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
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  summaryText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  progressBarWrapper: {
    gap: spacing.sm,
  },
  progressLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  monthLabel: {
    marginBottom: spacing.sm,
  },
  emptyState: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
});
