import { Text, View } from "react-native-ui-lib";
import IconSVG from "../../Shared/icons/IconSVG";

type MacroListItemProps = {
  color: string;
  macro: string;
};

export default function MacroLegendItem({ color, macro }: MacroListItemProps) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <IconSVG name="square-solid" color={color} width={16} />
      <Text text70M>{macro}</Text>
    </View>
  );
}
