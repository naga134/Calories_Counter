import { Colors, View, WheelPicker } from 'react-native-ui-lib';
import IconSVG from './icons/IconSVG';

export default function UnitPicker({
  showIcon,
  showIndicator,
  flipIndicator,
  units,
  onChange,
  backgroundColor,
  activeTextColor,
  inactiveTextColor,
}: {
  onChange: (unitId: number) => void;
  showIcon?: boolean;
  showIndicator?: boolean;
  flipIndicator?: boolean;
  units: {
    label: string;
    value: string;
  }[];
  backgroundColor: string;
  activeTextColor: string;
  inactiveTextColor: string;
}) {
  const indicator = flipIndicator ? { left: -16 } : { right: -16 };
  const ruler = flipIndicator ? { left: -32, transform: [{ rotate: '180deg' }] } : { right: -32 };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        borderRadius: 16,
        justifyContent: 'center',
      }}>
      {/* current choice indicator */}
      {showIndicator && (
        <IconSVG
          style={[
            {
              position: 'absolute',
              zIndex: 1,
              transform: [{ rotate: `${flipIndicator ? 270 : 90}deg` }],
            },
            indicator,
          ]}
          name="caret-down-solid"
          color={Colors.violet30}
          width={28}
        />
      )}
      {/* ruler icon */}
      {showIcon && (
        <IconSVG
          style={[
            {
              position: 'absolute',
              zIndex: 1,
            },
            ruler,
          ]}
          name="ruler-vertical-light"
          color={Colors.violet30}
          width={28}
        />
      )}
      <WheelPicker
        separatorsStyle={{ borderColor: backgroundColor }}
        flatListProps={{
          style: {
            borderRadius: 45,
            // bro what
            width: 100,
          },
        }}
        activeTextColor={activeTextColor}
        inactiveTextColor={inactiveTextColor}
        textStyle={{ fontSize: 18 }}
        style={{
          paddingHorizontal: 0,
          borderRadius: 16,
          backgroundColor: backgroundColor,
        }}
        itemHeight={40}
        numberOfVisibleRows={3}
        items={units}
        initialValue={units[0].value}
        onChange={onChange}
        faderProps={{ size: 0 }}
      />
    </View>
  );
}
