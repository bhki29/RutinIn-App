import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, typography, radius } from "../theme";
import { DAY_LABELS } from "../utils/dateUtils";

export default function DayToggleRow({
  selectedDays = [],
  onToggle,
  activeColor = colors.brand.green,
  readOnly = false,
}) {
  return (
    <View style={styles.row}>
      {DAY_LABELS.map((label, index) => {
        const isActive = selectedDays.includes(index);
        const Wrapper = readOnly ? View : TouchableOpacity;

        return (
          <Wrapper
            key={index}
            style={[
              styles.circle,
              isActive
                ? { backgroundColor: activeColor }
                : { borderWidth: 1, borderColor: colors.border },
            ]}
            onPress={readOnly ? undefined : () => onToggle(index)}
            accessibilityRole={readOnly ? undefined : "button"}
          >
            <Text
              style={[
                typography.label,
                {
                  color: isActive ? colors.text.onBrand : colors.text.secondary,
                },
              ]}
            >
              {label}
            </Text>
          </Wrapper>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
