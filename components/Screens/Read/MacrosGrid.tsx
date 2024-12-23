import IconSVG from 'components/Shared/icons/IconSVG';
import { useColors } from 'context/ColorContext';
import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';
import SegmentedMacrosBarChart from './SegmentedMacrosBarChart';

export default function MacrosGrid({ protein, carbs, fat, kcal }) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;

  const macros = {
    fat: {
      amount: fat,
      unit: 'g',
      icon: 'bacon-solid',
      accentColor: Colors.violet60,
    },
    carbs: {
      amount: carbs,
      unit: 'g',
      icon: 'wheat-solid',
      accentColor: Colors.violet50,
    },
    protein: {
      amount: protein,
      unit: 'g',
      icon: 'meat-solid',
      accentColor: Colors.violet40,
    },
    kcals: {
      amount: kcal,
      unit: 'kcal',
      icon: 'ball-pile-solid',
      accentColor: Colors.violet30,
    },
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
      {Object.entries(macros).map(([key, macro]) => (
        <View
          style={[
            styles.gridItem,
            { width: (screenWidth - 44) / 2, backgroundColor: colors.get(key) },
          ]}>
          <IconSVG name={macro.icon} color={macro.accentColor} width={40} />
          <Text style={styles.gridText}>
            {macro.amount} {macro.unit}
          </Text>
          <SegmentedMacrosBarChart />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 4,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gridText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: Colors.violet80,
    fontWeight: 500,
    paddingLeft: 10,
  },
});
