import { GestureResponderEvent, Pressable } from "react-native";
import IconSVG from "./icons/IconSVG";
import { Colors, Text } from "react-native-ui-lib";

type MacroOverviewProps = {
  color: string;
  onPress: (event: GestureResponderEvent) => void; // Update type to match onPress,
  iconName: "meat-solid" | "wheat-solid" | "bacon-solid" | "ball-pile-solid";
  amount: number;
  unit: string;
};

export default function MacroOverview({
  color,
  onPress,
  iconName,
  amount,
  unit,
}: MacroOverviewProps) {
  return (
    <Pressable
      style={{
        flex: 1,
        gap: 8,
        backgroundColor: color,
        // borderBottomLeftRadius: 12,
        // borderBottomRightRadius: 12,
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <IconSVG color={Colors.white} width={28} name={iconName} />
      <Text style={{ color: Colors.white, fontSize: 18, fontWeight: 500 }}>
        {amount}
      </Text>
    </Pressable>
  );
}
