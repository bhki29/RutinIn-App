import { StyleSheet, Text, View } from "react-native";

export default function CreateHabitScreen() {
  return (
    <View style={styles.container}>
      <Text>Create Habit Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
