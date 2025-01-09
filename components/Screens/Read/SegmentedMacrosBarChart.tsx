import { Colors, Text, View } from 'react-native-ui-lib';
import IconSVG from 'components/Shared/icons/IconSVG';
import AnimatedBar from 'components/Screens/Create/AnimatedBar';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet } from 'react-native';
import { useColors } from 'context/ColorContext';
import { ViewMode } from './ToggleView';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

type Macros = {
  fat: number;
  protein: number;
  carbs: number;
};

type MacrosBarChartProps = {
  viewMode: ViewMode;
  currentMacros: Macros;
  macrosToAdd: Macros;
};

type BarElement = {
  color: string;
  currentAmount: number;
  amountToAdd: number;
  icon: 'bacon-solid' | 'wheat-solid' | 'meat-solid';
};

export default function SegmentedMacrosBarChart({
  viewMode,
  currentMacros,
  macrosToAdd,
}: MacrosBarChartProps) {
  const colors = useColors();
  const isSimple = viewMode === ViewMode.Simple;

  const macros: BarElement[] = [
    {
      color: colors.get('fat'),
      icon: 'bacon-solid',
      currentAmount: currentMacros.fat,
      amountToAdd: macrosToAdd.fat,
    },
    {
      color: colors.get('carbs'),
      icon: 'wheat-solid',
      currentAmount: currentMacros.carbs,
      amountToAdd: macrosToAdd.carbs,
    },
    {
      color: colors.get('protein'),
      icon: 'meat-solid',
      currentAmount: currentMacros.protein,
      amountToAdd: macrosToAdd.protein,
    },
  ];

  const currentMax =
    Math.max(
      currentMacros.fat + macrosToAdd.fat,
      currentMacros.carbs + macrosToAdd.carbs,
      currentMacros.protein + macrosToAdd.protein
    ) || 1;

  const animatedMaxAmount = useSharedValue(currentMax);
  useEffect(() => {
    animatedMaxAmount.value = withTiming(currentMax, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [currentMax]);

  const maxWidth = Dimensions.get('window').width - 100;

  return (
    // A linear gradient made unto border
    <LinearGradient
      colors={[Colors.violet30, Colors.violet60]}
      end={{ x: 0, y: 0.5 }}
      style={{ borderRadius: 20, paddingHorizontal: 2, paddingBottom: 2 }}>
      <View row>
        {/* Each macronutrient's overview */}
        {macros.map((macro, index) => (
          <View
            key={index}
            style={[
              styles.macroBox,
              {
                backgroundColor: macro.color,
                borderTopLeftRadius: index === 0 ? 19 : 0,
                borderTopRightRadius: index === 2 ? 19 : 0,
              },
            ]}>
            <IconSVG color={Colors.white} width={28} name={macro.icon} />
            <Text style={styles.macroText}>{macro.amountToAdd}</Text>
          </View>
        ))}
      </View>
      {/* The chart itself*/}
      <View style={styles.barChart}>
        {macros.map((macro) => (
          <View key={macro.icon} style={styles.barFlex}>
            <View
              row
              style={{ borderTopEndRadius: 8, borderBottomRightRadius: 8, overflow: 'hidden' }}>
              <AnimatedBar
                width={
                  (maxWidth * macro.currentAmount) / currentMax +
                  (!isSimple && macro.amountToAdd === 0 ? 8 : 0)
                }
                color={Colors.grey50}
              />
              <AnimatedBar
                width={
                  (maxWidth * macro.amountToAdd) / currentMax +
                  (isSimple && macro.amountToAdd === 0 ? 8 : 0)
                }
                color={macro.color}
              />
            </View>
            <IconSVG width={28} name={macro.icon} color={macro.color} style={{ marginLeft: 6 }} />
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  macroBox: {
    flex: 1,
    gap: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 500,
  },
  barChart: {
    overflow: 'hidden',
    gap: 12,
    backgroundColor: Colors.grey70,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomStartRadius: 19,
    borderBottomEndRadius: 19,
  },
  barFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    // ,
  },
});
