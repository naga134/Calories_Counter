import { Colors, WheelPicker } from 'react-native-ui-lib';
import { Unit } from 'database/types';

type UnitPickerProps = {
  units: Unit[];
  onChange: (unit: Unit) => void;
};

export default function UnitPicker({ units, onChange }: UnitPickerProps) {
  const items = units.map((unit) => ({ label: unit.symbol, value: unit.id }));

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
      style={{ paddingHorizontal: 0, borderRadius: 16 }}
    />
  );
}
