import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, shadow } from "../theme";
import Header from "../components/Header";
import TabSwitcher from "../components/TabSwitcher";
import TodayScreen from "./TodayScreen";
import WeeklyScreen from "./WeeklyScreen";
import OverallScreen from "./OverallScreen";

const SCREENS = {
  Today: TodayScreen,
  Weekly: WeeklyScreen,
  Overall: OverallScreen,
};

export default function MainScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Today");
  const ActiveScreenComponent = SCREENS[activeTab];

  return (
    <View style={styles.container}>
      <Header onProfilePress={() => {}} />
      <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />

      <View style={styles.content}>
        <ActiveScreenComponent />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateHabit")}
        accessibilityLabel="Tambah habit baru"
      >
        <Ionicons name="add" size={28} color={colors.text.onBrand} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: spacing.xl,
    bottom: spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.green,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.floatingButton,
  },
});
