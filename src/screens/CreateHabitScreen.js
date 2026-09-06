import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors, typography, spacing, radius } from "../theme";
import { HABIT_ICONS } from "../constants/habitOptions";
import { createHabit } from "../db/habitsRepository";
import Icon from "../components/Icon";
import Stepper from "../components/Stepper";
import DayToggleRow from "../components/DayToggleRow";

const REPEAT_OPTIONS = [
  { key: "everyday", label: "Everyday" },
  { key: "specific_days", label: "Specific days" },
  { key: "x_per_week", label: "X per week" },
];

function FieldLabel({ children }) {
  return <Text style={[typography.label, styles.fieldLabel]}>{children}</Text>;
}

export default function CreateHabitScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);

  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(
    colors.habitColorOptions[0],
  );

  const [repeatType, setRepeatType] = useState("everyday");
  const [repeatDays, setRepeatDays] = useState([1, 3, 5]);
  const [repeatTarget, setRepeatTarget] = useState(3);

  const [targetStreak, setTargetStreak] = useState(30);
  const [saving, setSaving] = useState(false);

  const isNameValid = name.trim().length > 0;

  function toggleRepeatDay(dayIndex) {
    setRepeatDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort((a, b) => a - b),
    );
  }

  async function handleCreate() {
    if (!isNameValid || saving) return;

    setSaving(true);
    try {
      await createHabit({
        name: name.trim(),
        description: description.trim() || null,
        durationMinutes: duration,
        icon: selectedIcon.id,
        color: selectedColor,
        repeatType,
        repeatDays: repeatType === "specific_days" ? repeatDays : null,
        repeatTarget: repeatType === "x_per_week" ? repeatTarget : null,
        targetStreakMilestone: targetStreak,
      });
      navigation.goBack();
    } catch (err) {
      console.error("Gagal menyimpan habit:", err);
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={[typography.h1, { color: colors.text.primary }]}>
          New Habit
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Tutup"
        >
          <Ionicons name="close" size={18} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Habit Name */}
          <FieldLabel>Habit Name</FieldLabel>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Go to gym"
            placeholderTextColor={colors.text.muted}
          />

          {/* Description */}
          <FieldLabel>Description</FieldLabel>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Morning workout"
            placeholderTextColor={colors.text.muted}
          />

          {/* Duration */}
          <FieldLabel>Duration</FieldLabel>
          <Stepper
            value={duration}
            onChange={setDuration}
            min={0}
            max={480}
            step={5}
            label="Minutes"
          />

          {/* Choose Icon & Color */}
          <FieldLabel>Choose Icon & Color</FieldLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.iconRow}
          >
            {HABIT_ICONS.map((iconOption) => {
              const isActive = iconOption.id === selectedIcon.id;
              return (
                <TouchableOpacity
                  key={iconOption.id}
                  style={[
                    styles.iconOption,
                    isActive && {
                      borderColor: selectedColor,
                      backgroundColor: colors.surfaceMuted,
                    },
                  ]}
                  onPress={() => setSelectedIcon(iconOption)}
                >
                  <Icon
                    family={iconOption.family}
                    name={iconOption.name}
                    size={20}
                    color={isActive ? selectedColor : colors.text.secondary}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.colorRow}>
            {colors.habitColorOptions.map((colorHex) => {
              const isActive = colorHex === selectedColor;
              return (
                <TouchableOpacity
                  key={colorHex}
                  style={[styles.colorSwatch, { backgroundColor: colorHex }]}
                  onPress={() => setSelectedColor(colorHex)}
                >
                  {isActive ? (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={colors.text.onBrand}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Repeat */}
          <FieldLabel>Repeat</FieldLabel>
          <View style={styles.segmented}>
            {REPEAT_OPTIONS.map((option) => {
              const isActive = option.key === repeatType;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.segment, isActive && styles.segmentActive]}
                  onPress={() => setRepeatType(option.key)}
                >
                  <Text
                    style={[
                      typography.label,
                      {
                        color: isActive
                          ? colors.text.primary
                          : colors.text.secondary,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {repeatType === "specific_days" && (
            <View style={styles.repeatDetail}>
              <DayToggleRow
                selectedDays={repeatDays}
                onToggle={toggleRepeatDay}
                activeColor={selectedColor}
              />
            </View>
          )}

          {repeatType === "x_per_week" && (
            <View style={styles.repeatDetail}>
              <Stepper
                value={repeatTarget}
                onChange={setRepeatTarget}
                min={1}
                max={7}
                label="times a week"
              />
            </View>
          )}

          {/* Target Streak Milestone */}
          <FieldLabel>Target Streak Milestone</FieldLabel>
          <Stepper
            value={targetStreak}
            onChange={setTargetStreak}
            min={1}
            max={365}
            step={1}
            label="Days Goal"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={[styles.submitButton, !isNameValid && styles.submitDisabled]}
        onPress={handleCreate}
        disabled={!isNameValid || saving}
      >
        <Text style={[typography.button, { color: colors.text.onBrand }]}>
          {saving ? "Saving..." : "Create Habit"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  fieldLabel: {
    textTransform: "uppercase",
    color: colors.text.secondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  iconRow: {
    flexGrow: 0,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  colorSwatch: {
    width: 35,
    height: 35,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: colors.surface,
  },
  repeatDetail: {
    marginTop: spacing.md,
  },
  submitButton: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.brand.green,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  submitDisabled: {
    opacity: 0.5,
  },
});
