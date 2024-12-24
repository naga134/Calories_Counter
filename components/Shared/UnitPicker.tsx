import { Colors, WheelPicker } from 'react-native-ui-lib';
import { Unit } from 'database/types';

type UnitPickerProps = {
  units: Unit[];
  onChange: (unit: Unit) => void;
  direction?: 'vertical' | 'horizontal';
};

export default function UnitPicker({ units, onChange, direction = 'vertical' }: UnitPickerProps) {
  const items = units.map((unit) => ({ label: unit.symbol, value: unit.id }));

  const textStyle = direction === 'horizontal' ? { transform: [{ rotate: '90deg' }] } : undefined;

  const containerStyle =
    direction === 'horizontal' ? { transform: [{ rotate: '-90deg' }] } : undefined;

  return (
    <WheelPicker
      items={items}
      onChange={(item) => {
        const unit = units.find((unit) => unit.id === item);
        if (unit) onChange(unit);
      }}
      itemHeight={52}
      numberOfVisibleRows={3}
      faderProps={{ size: 0 }}
      separatorsStyle={{ borderColor: Colors.white }}
      flatListProps={{ style: { borderRadius: 45 }, nestedScrollEnabled: true }}
      textStyle={textStyle}
      style={{
        paddingHorizontal: 0,
        borderRadius: 16,
        ...containerStyle, // Conditionally add rotation if horizontal
      }}
    />
  );
}
