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
        backgroundColor: color,
        borderRadius: 10,
        padding: 8,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={onPress}
    >
      <IconSVG color={Colors.white} width={28} name={iconName} />
      <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 700 }}>
        {amount}
        <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 500 }}>
          {unit}
        </Text>
      </Text>
    </Pressable>
  );
}
