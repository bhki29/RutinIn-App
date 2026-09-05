import colors from "./colors";
import typography, { fontFamily } from "./typography";
import { spacing, radius, shadow } from "./spacing";

export { colors, typography, fontFamily, spacing, radius, shadow };
export { useAppFonts } from "./fonts";

const theme = { colors, typography, fontFamily, spacing, radius, shadow };
export default theme;
