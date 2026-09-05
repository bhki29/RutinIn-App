import { StyleSheet, Text, View } from "react-native";
import { colors, typography, spacing } from "../theme";

export default function OverallScreen() {
  return (
    <View style={styles.container}>
      <Text style={[typography.body, { color: colors.text.secondary }]}>
        Overall Screen belum diimplementasikan
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
});
