import { View, StyleSheet } from "react-native";
import { colors, radius } from "../theme";

export default function ProgressBar({
  progress = 0,
  color = colors.brand.green,
  trackColor = colors.surfaceMuted,
  height = 8,
}) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, backgroundColor: color, height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fill: {
    borderRadius: radius.pill,
  },
});
