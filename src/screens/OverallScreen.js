import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { colors, typography, spacing, radius, shadow } from "../theme";
import {
  getHabitsWithStats,
  getTotalCheckInsCount,
  getOverallBestStreak,
} from "../db/habitsRepository";
import { getRepeatLabel } from "../utils/streakUtils";

import HabitCard from "../components/HabitCard";
import ProgressBar from "../components/ProgressBar";
import ContributionHeatmap from "../components/ContributionHeatmap";

export default function OverallScreen() {
  const [habits, setHabits] = useState([]);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [habitsData, checkInsTotal, best] = await Promise.all([
        getHabitsWithStats(),
        getTotalCheckInsCount(),
        getOverallBestStreak(),
      ]);
      setHabits(habitsData);
      setTotalCheckIns(checkInsTotal);
      setBestStreak(best);
    } catch (err) {
      console.error("Gagal memuat data Overall:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

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
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[typography.label, { color: colors.text.muted }]}>
            YEAR TO DATE
          </Text>
          <Text style={[typography.h1, { color: colors.text.primary }]}>
            Consistency Matrix
          </Text>
        </View>
        <View style={styles.headerIconCircle}>
          <Ionicons name="trending-up" size={22} color={colors.brand.green} />
        </View>
      </View>

      {/* Stat cards */}
      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <View style={styles.statHeaderRow}>
            <Text style={[typography.label, { color: colors.text.muted }]}>
              CHECK-INS
            </Text>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.brand.green}
            />
          </View>
          <Text
            style={[typography.numberLarge, { color: colors.text.primary }]}
          >
            {totalCheckIns}
          </Text>
          <Text style={[typography.caption, { color: colors.text.muted }]}>
            Total record logs
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeaderRow}>
            <Text style={[typography.label, { color: colors.text.muted }]}>
              BEST STREAK
            </Text>
            <Ionicons name="flame" size={16} color={colors.brand.orange} />
          </View>
          <Text
            style={[typography.numberLarge, { color: colors.text.primary }]}
          >
            {bestStreak} Days
          </Text>
          <Text style={[typography.caption, { color: colors.text.muted }]}>
            Personal record
          </Text>
        </View>
      </View>

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
        habits.map((habit) => {
          const hasMilestone = !!habit.targetStreakMilestone;
          const milestonePercent = hasMilestone
            ? Math.round(
                (habit.currentStreak / habit.targetStreakMilestone) * 100,
              )
            : 0;

          return (
            <HabitCard
              key={habit.id}
              habit={habit}
              subtitle={getRepeatLabel(habit)}
              streak={habit.currentStreak}
            >
              {hasMilestone ? (
                <View style={styles.milestoneWrapper}>
                  <ProgressBar
                    progress={milestonePercent}
                    color={habit.color}
                    trackColor={colors.surfaceMuted}
                    height={5}
                  />
                  <Text
                    style={[typography.caption, { color: colors.text.muted }]}
                  >
                    {habit.currentStreak} / {habit.targetStreakMilestone} Days
                    Goal
                  </Text>
                </View>
              ) : null}

              <ContributionHeatmap
                habit={habit}
                checkInSet={habit.checkInSet}
              />
            </HabitCard>
          );
        })
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.soft,
  },
  statRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 4,
    ...shadow.soft,
  },
  statHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  milestoneWrapper: {
    marginTop: spacing.sm,
    marginLeft: 56, // sejajar dengan teks nama (icon 44px + gap 12px di HabitCard)
    gap: spacing.xs,
  },
  emptyState: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
});
