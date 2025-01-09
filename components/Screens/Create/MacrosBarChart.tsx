import { Colors, Text, View } from 'react-native-ui-lib';
import IconSVG from 'components/Shared/icons/IconSVG';
import AnimatedBar from 'components/Screens/Create/AnimatedBar';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet } from 'react-native';
import { useColors } from 'context/ColorContext';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

type macro = {
  color: string;
  amount: number;
  icon: 'bacon-solid' | 'wheat-solid' | 'meat-solid';
};

type MacrosBarChartProps = {
  fat: number;
  carbs: number;
  protein: number;
};

export default function MacrosBarChart({ fat, carbs, protein }: MacrosBarChartProps) {
  const colors = useColors();

  const macros: macro[] = [
    { color: colors.get('fat'), icon: 'bacon-solid', amount: fat },
    { color: colors.get('carbs'), icon: 'wheat-solid', amount: carbs },
    { color: colors.get('protein'), icon: 'meat-solid', amount: protein },
  ];

  const currentMax = Math.max(fat, carbs, protein) || 1;

  const maxWidth = Dimensions.get('window').width - 100;

  const animatedMaxAmount = useSharedValue(currentMax);
  useEffect(() => {
    animatedMaxAmount.value = withTiming(currentMax, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [currentMax]);

  return (
    // A linear gradient made unto border
    <LinearGradient
      colors={[Colors.violet30, Colors.violet60]}
      end={{ x: 0, y: 0.5 }}
      style={{ borderRadius: 20, paddingHorizontal: 2, paddingBottom: 2 }}>
      <View row>
        {/* Each macronutrient overview */}
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
            <Text style={styles.macroText}>{macro.amount}</Text>
          </View>
        ))}
      </View>
      {/* The chart itself*/}
      <View style={styles.barChart}>
        {macros.map((macro) => (
          <View key={macro.icon} style={styles.barFlex}>
            <AnimatedBar
              width={
                (maxWidth * macro.amount) / currentMax +
                (macros.some((macro) => macro.amount === 0) ? 8 : 0)
              }
              color={macro.color}
              style={{ borderTopEndRadius: 8, borderBottomEndRadius: 8 }}
            />
            <IconSVG width={28} name={macro.icon} color={macro.color} />
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
    gap: 8,
  },
});
