import { GestureResponderEvent, Pressable } from 'react-native';
import IconSVG from './icons/IconSVG';
import { Colors, Text } from 'react-native-ui-lib';

type MacroOverviewProps = {
  color: string;
  iconName: 'meat-solid' | 'wheat-solid' | 'bacon-solid' | 'ball-pile-solid';
  amount: number;
  unit: string;
};

export default function MacroOverview({ color, iconName, amount, unit }: MacroOverviewProps) {
  return (
    <Pressable
      style={{
        flex: 1,
        gap: 8,
        backgroundColor: color,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <IconSVG color={Colors.white} width={28} name={iconName} />
      <Text style={{ color: Colors.white, fontSize: 18, fontWeight: 500 }}>{amount}</Text>
    </Pressable>
  );
}
