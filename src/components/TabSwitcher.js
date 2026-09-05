import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, typography, spacing, radius } from "../theme";

const TABS = [
  { key: "Today", label: "Todays" },
  { key: "Weekly", label: "Weekly" },
  { key: "Overall", label: "Overall" },
];

export default function TabSwitcher({ activeTab, onChange }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                typography.body,
                {
                  color: isActive ? colors.text.primary : colors.text.secondary,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: 4,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.brand.white,
  },
});
