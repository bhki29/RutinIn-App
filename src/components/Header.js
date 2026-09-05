import { View, Text, StyleSheet, Image } from "react-native";
import { colors, typography, spacing } from "../theme";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logoImage}
        />
        <Text style={typography.logo}>
          <Text style={{ color: colors.brand.green }}>Rutin</Text>
          <Text style={{ color: colors.brand.black }}>In</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  logoImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
  },
});
