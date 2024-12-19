import { Colors, Text, View } from 'react-native-ui-lib';
import IconSVG from 'components/Shared/icons/IconSVG';

import icons from '../../Shared/icons/SVGs';
import { StyleSheet } from 'react-native';
import CustomNumberInput from 'components/CustomNumberInput';
type IconName = keyof typeof icons;

type MacroInputFieldProps = {
  text: string;
  onChangeText: (text: string) => void;
  color?: string;
  unitSymbol: string;
  unitIndicatorWidth?: number;
  iconName: IconName;
  maxLength: number;
  placeholder?: string;
};

export default function MacroInputField({
  text,
  onChangeText,
  iconName,
  color = Colors.violet30,
  unitIndicatorWidth = 40,
  unitSymbol,
  maxLength,
  placeholder,
}: MacroInputFieldProps) {
  return (
    <View row style={{ height: 40 }}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <IconSVG width={24} name={iconName} color={Colors.white} style={{ margin: 'auto' }} />
      </View>
      <View flex bg-white>
        <CustomNumberInput
          value={text}
          onChange={onChangeText}
          maxLength={maxLength}
          placeholder={placeholder}
        />
      </View>
      <View style={[styles.unitIndicator, { width: unitIndicatorWidth }]}>
        <Text style={styles.unitIndicatorText}>{unitSymbol}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 44,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  unitIndicator: {
    backgroundColor: Colors.grey60,
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  unitIndicatorText: {
    fontSize: 18,
    color: Colors.grey40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
