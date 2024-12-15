import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Food, Nutritable } from 'database/types';
import { useEffect, useMemo, useState } from 'react';
import { Colors, Icon, NumberInput, Text, TextField, View, WheelPicker } from 'react-native-ui-lib';

// import WheelPicker from '@quidone/react-native-wheel-picker';
import { StyleSheet } from 'react-native';
import IconSVG from './icons/IconSVG';
import AnimatedCircleButton from './AnimatedCircleButton';
import { useColors } from 'context/ColorContext';
import toSQLiteParams from 'utils/toSQLiteParams';
import { getNutritablesByFood } from 'database/queries/nutritablesQueries';
import { useSQLiteContext } from 'expo-sqlite';
import toCapped from 'utils/toCapped';
import UnitPicker from './UnitPicker';
import { RootStackParamList } from 'navigation';
import { useQuery } from '@tanstack/react-query';
import { getAllUnits } from 'database/queries/unitsQueries';

export default function FoodReadDetails({
  food,
  nutritables,
}: {
  food: Food;
  nutritables: Nutritable[];
}) {
  const database = useSQLiteContext();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const colors = useColors();

  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [kcals, setKcals] = useState(0);
  const [protein, setProtein] = useState(0);

  const [amount, setAmount] = useState(0);

  // Retrieving all possible measurement units.
  const { data: allUnits = [], isFetched: unitsFetched } = useQuery({
    queryKey: ['allUnits'],
    queryFn: () => getAllUnits(database),
    initialData: [],
  });

  const units = nutritables.map((nutritable) => nutritable.unit);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(units[0].id);

  useEffect(() => {
    if (units.length > 0 && selectedUnitId === null) {
      setSelectedUnitId(units[0].id);
    } else if (units.length > 0 && !units.some((unit) => unit.id === selectedUnitId)) {
      // If the current selectedUnitId is no longer valid, we reset it
      setSelectedUnitId(units[0].id);
    }
  }, [units, selectedUnitId]);

  // const selectedUnit = useMemo(() => {
  //   return units.find((unit) => unit.id === selectedUnitId);
  // }, [units, selectedUnitId]);

  const selectedNutritable = useMemo(() => {
    return nutritables.find((nutritable) => nutritable.unit.id === selectedUnitId);
  }, [units, selectedUnitId]);

  const macroItems = [
    { color: colors.get('fat'), iconName: 'bacon-solid', amount: fats },
    {
      color: colors.get('carbohydrates'),
      iconName: 'wheat-solid',
      amount: carbs,
    },
    {
      color: colors.get('protein'),
      iconName: 'meat-solid',
      amount: protein,
    },
  ] as const;

  // (!!!) This is sometimes breaking when the user tries to select a newly-created nutritable
  useEffect(() => {
    setProtein((amount / selectedNutritable!.baseMeasure) * selectedNutritable!.protein);
    setFats((amount / selectedNutritable!.baseMeasure) * selectedNutritable!.fats);
    setCarbs((amount / selectedNutritable!.baseMeasure) * selectedNutritable!.carbs);
    setKcals((amount * selectedNutritable!.kcals) / selectedNutritable!.baseMeasure);
  }, [amount, selectedNutritable]);

  const availableUnits = allUnits.filter(
    (unit) => !units.some((usedUnit) => usedUnit.symbol === unit.symbol)
  );

  return (
    // Whole thing
    <View style={styles.cardLayout}>
      {/* TOP SECTION: Macros Overview */}
      <View style={styles.topSection}>
        {macroItems.map((macro, i) => (
          <MacroQuantity key={macro.iconName} iconName={macro.iconName} amount={macro.amount} />
        ))}
      </View>
      {/* Amount and Unit section */}
      <View style={styles.midSection}>
        <KcalsOverview amount={kcals} />
        <WeightScale setAmount={setAmount} />
        <UnitPicker
          units={units}
          showIcon
          showIndicator
          backgroundColor={Colors.violet70}
          activeTextColor={Colors.violet20}
          inactiveTextColor={Colors.violet50}
          onChange={(unitId: number) => setSelectedUnitId(unitId)}
        />
      </View>
      {/* Action buttons section */}
      <View style={styles.bottomSection}>
        {/* EDIT NUTRITABLE BUTTON */}
        <AnimatedCircleButton
          onPress={() => navigation.navigate('Edit', { nutritable: selectedNutritable!, food })}
          buttonStyle={styles.circleButton}
          iconProps={{
            style: { marginLeft: 6 },
            name: 'solid-square-list-pen',
            width: 32,
            color: Colors.white,
          }}
        />
        {/* DELETE NUTRITABLE BUTTON */}
        <AnimatedCircleButton
          onPress={() => {}}
          buttonStyle={styles.circleButton}
          iconProps={{
            style: { marginLeft: 3 },
            name: 'solid-square-list-circle-xmark',
            width: 32,
            color: Colors.white,
          }}
        />
        {/* ADD NUTRITABLE BUTTON */}
        <AnimatedCircleButton
          disabled={availableUnits.length === 0}
          onPress={() =>
            navigation.navigate('Add', {
              food,
              units: availableUnits,
            })
          }
          buttonStyle={styles.circleButton}
          iconProps={{
            style: { marginLeft: 3 },
            name: 'solid-square-list-circle-plus',
            width: 32,
            color: Colors.white,
          }}
        />
        {/* ADD TO MEAL BUTTON */}
        <AnimatedCircleButton
          onPress={() => {}}
          buttonStyle={styles.circleButton}
          iconProps={{
            name: 'utensils-solid',
            style: { marginRight: 1 },
            width: 26,
            color: Colors.white,
          }}
        />
      </View>
    </View>
  );
}

function KcalsOverview({ amount }: { amount: number }) {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.violet70,
        width: 68,
        borderRadius: 16,
      }}>
      <IconSVG name="ball-pile-solid" color={Colors.violet30} style={{ marginBottom: 8 }} />
      <Text style={{ color: Colors.violet30, fontSize: 18, fontWeight: 500 }}>
        {amount.toFixed(0)}
      </Text>
      <Text style={{ color: Colors.violet30, fontSize: 18, fontWeight: 500 }}>kcal</Text>
    </View>
  );
}

// change later: use TextInput instead to limit max characters
function WeightScale({ setAmount }) {
  return (
    <View style={styles.weightScale}>
      <IconSVG name="gauge-solid" color={Colors.violet70} width={32} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <IconSVG
          style={{ transform: [{ rotate: '90deg' }] }}
          name="caret-down-solid"
          width={12}
          color={Colors.violet50}
        />
        {/* TODO: limit the amount of digits accepted */}
        {/* suggestion: use TextInput instead: https://www.ifelsething.com/post/limit-text-length-react-native-text-input/ */}
        {/* and customize the onChangeText function */}
        <NumberInput
          onChangeNumber={(number) => {
            if (number.type === 'valid') {
              setAmount(number.number);
            }
          }}
          fractionDigits={2}
          // TODO: handle text overflow
          containerStyle={{
            backgroundColor: Colors.violet70,
            width: 80,
            borderRadius: 8,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          textFieldProps={{
            style: {
              color: Colors.violet20,
              fontSize: 18,
            },
          }}
        />
        <IconSVG
          style={{ transform: [{ rotate: '-90deg' }] }}
          name="caret-down-solid"
          width={12}
          color={Colors.violet50}
        />
      </View>
    </View>
  );
}

function MacroQuantity({
  amount,
  iconName,
}: {
  amount: number;
  iconName: 'bacon-solid' | 'wheat-solid' | 'meat-solid' | 'ball-pile-solid';
}) {
  return (
    <View style={styles.macroQuantity}>
      {/* Macronutrient's icon */}
      <IconSVG color={Colors.white} width={28} name={iconName} />
      {/* Macronutrient's amount */}
      <Text
        white
        style={{
          color: Colors.white,
          fontSize: 18,
          fontWeight: 500,
        }}>
        {toCapped(amount, 2)}g
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // The entire container
  cardLayout: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 20,
    gap: 12,
  },
  // The flexbox that holds the action buttons
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.violet70,
    paddingBottom: 12,
    paddingTop: 12,
    borderRadius: 24,
  },
  // The flexbox that holds each macro's quantity indicator

  // Each macro's quantity indicator
  macroQuantity: {
    flex: 1,
    gap: 8,
    backgroundColor: Colors.violet30,
    padding: 8,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  // Each circular button
  circleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: '100%',
    backgroundColor: Colors.violet30,
  },
  //
  weightScale: {
    flex: 1,
    flexGrow: 1.5,
    padding: 20,
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: Colors.violet30,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  //
  midSection: {
    position: 'relative',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  topSection: { flexDirection: 'row', gap: 8 },
});
