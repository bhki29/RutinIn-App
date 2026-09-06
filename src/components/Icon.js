import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const FAMILIES = {
  MaterialCommunityIcons,
  Ionicons,
};

export default function Icon({ family, name, size = 20, color = "#000" }) {
  const IconComponent = FAMILIES[family] || MaterialCommunityIcons;
  return <IconComponent name={name} size={size} color={color} />;
}
