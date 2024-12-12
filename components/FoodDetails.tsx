import { useNavigation } from '@react-navigation/native';
import { Food, Nutritable } from 'database/types';
import { useEffect, useState } from 'react';
import { Colors, Icon, NumberInput, Text, TextField, View, WheelPicker } from 'react-native-ui-lib';

// import WheelPicker from '@quidone/react-native-wheel-picker';
import { StyleSheet } from 'react-native';
import IconSVG from './icons/IconSVG';
import AnimatedCircleButton from './AnimatedCircleButton';
import { useColors } from 'context/ColorContext';
import toSQLiteParams from 'utils/toSQLiteParams';
import getNutritables from 'database/queries/nutritablesQueries';
import { useSQLiteContext } from 'expo-sqlite';
import toCapped from 'utils/toCapped';

export default function FoodDetails({
  food,
  nutritables,
}: {
  food: Food;
  nutritables: Nutritable[];
}) {
  const navigation = useNavigation();
  const colors = useColors();

  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [kcals, setKcals] = useState(0);
  const [protein, setProtein] = useState(0);

  const [amount, setAmount] = useState(0);

  // TODO : change this to calculate based on the currently selected unit's nutritable

  useEffect(() => {
    setProtein((amount / nutritables[0].baseMeasure) * nutritables[0].protein);
    setFats((amount / nutritables[0].baseMeasure) * nutritables[0].fats);
    setCarbs((amount / nutritables[0].baseMeasure) * nutritables[0].carbs);
    setKcals((amount * nutritables[0].kcals) / nutritables[0].baseMeasure);
  }, [amount]);

  const units = nutritables.map((nutritable) => ({
    label: nutritable.unit.symbol,
    value: nutritable.unit.id,
  }));

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
        <UnitPicker units={units} />
      </View>
      {/* Action buttons section */}
      <View style={styles.bottomSection}>
        {/* EDIT NUTRITABLE BUTTON */}
        <AnimatedCircleButton
          onPress={() => navigation.navigate('Edit')}
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
          onPress={() => navigation.navigate('Add')}
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

function UnitPicker({ units }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.violet70,
        borderRadius: 16,
        justifyContent: 'center',
        position: 'relative',
        //   width: 68,
      }}>
      {/* current choice indicator */}
      <IconSVG
        style={{
          position: 'absolute',
          zIndex: 1,
          right: -16,
          transform: [{ rotate: '90deg' }],
        }}
        name="caret-down-solid"
        color={Colors.violet30}
        width={28}
      />
      {/* ruler icon */}
      <IconSVG
        style={{
          position: 'absolute',
          zIndex: 1,
          right: -32,
        }}
        name="ruler-vertical-light"
        color={Colors.violet30}
        width={28}
      />
      <WheelPicker
        separatorsStyle={{ borderColor: Colors.violet70 }}
        flatListProps={{ style: { borderRadius: 45 } }}
        activeTextColor={Colors.violet20}
        textStyle={{ fontSize: 18 }}
        style={{
          borderRadius: 16,
          backgroundColor: Colors.violet70,
        }}
        itemHeight={40}
        numberOfVisibleRows={3}
        items={units}
        initialValue={units[0].value}
        onChange={(value) => console.log(value)}
        faderProps={{ size: 0 }}
      />
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
