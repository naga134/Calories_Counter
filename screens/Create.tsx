import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import {
  Button,
  Colors,
  Dialog,
  KeyboardAwareScrollView,
  TextField,
  View,
} from 'react-native-ui-lib';
import { useColors } from 'context/ColorContext';
import IconSVG from 'components/Shared/icons/IconSVG';
import MacrosBarChart from 'components/Screens/Create/MacrosBarChart';
import MacroInputField from 'components/Screens/Create/MacroInputField';
import { useQuery } from '@tanstack/react-query';
import { getAllUnits } from 'database/queries/unitsQueries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import UnitPicker from 'components/Shared/UnitPicker';
import { Unit } from 'database/types';
import calculateCalories from 'utils/calculateCalories';
import { getAllFoodNames } from 'database/queries/foodsQueries';
import { validateFoodInputs } from 'utils/validation/validateFood';
import { ErrorType, Validation, ValidationStatus } from 'utils/validation/types';

// (!!!) This screen produces a warning due to nesting UnitPicker inside a KeyboardAwareScrollView.
// Nevertheless, this is strictly necessary to avoid the keyboard from covering the bottom-most input fields.
export default function Create() {
  const colors = useColors();
  const database: SQLiteDatabase = useSQLiteContext();

  // Fetches the names of all existing foods
  const { data: names = [], isFetched: namesFetched } = useQuery({
    queryKey: ['allNames'],
    queryFn: () => getAllFoodNames(database),
    initialData: [],
  });

  // Fetches all measurement units
  const { data: units = [], isFetched: unitsFetched } = useQuery({
    queryKey: ['allUnits'],
    queryFn: () => getAllUnits(database),
    initialData: [],
  });

  // Stateful nutritional data
  const [name, setName] = useState('');
  const [kcals, setKcals] = useState('');
  const [measure, setMeasure] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');

  // Calculates expected kcals
  const [expectedKcals, setExpectedKcals] = useState('');
  useEffect(() => {
    setExpectedKcals(
      calculateCalories(Number(protein), Number(carbs), Number(fat)).toFixed(2).toString()
    );
  }, [protein, carbs, fat]);

  // TODO: go back to  the db schema and manually set the ids for each unit.
  const [selectedUnit, setSelectedUnit] = useState<Unit>({ id: 1, symbol: 'g' });

  // Initializes the validation status
  const [validation, setValidation] = useState<Validation>({
    status: ValidationStatus.Valid,
    errors: [],
  });

  // Resets the validation status
  const resetValidation = () =>
    setValidation({
      status: ValidationStatus.Valid,
      errors: [],
    });

  // Resets the validation status every time a field changes
  useEffect(resetValidation, [name, kcals, measure, fat, protein, carbs]);

  if (!unitsFetched) return <></>;

  return (
    <>
      {/* Show the warnings here once the Dialogs component is done */}
      {/* <Dialog /> */}
      <KeyboardAwareScrollView
        behavior="padding"
        nestedScrollEnabled
        extraScrollHeight={160}
        contentContainerStyle={styles.container}>
        <View style={styles.nameField}>
          <TextInput
            placeholder="New Food"
            onChangeText={(text) => setName(text)}
            placeholderTextColor={Colors.violet40}
            style={styles.nameInput}
          />
        </View>
        {/* Graph */}
        <MacrosBarChart fat={Number(fat)} carbs={Number(carbs)} protein={Number(protein)} />
        {/* Macros & Unit */}
        <View row gap-20>
          {/* Macros */}
          <View flex gap-20>
            {/* Fat */}
            <MacroInputField
              text={fat}
              onChangeText={(text) => setFat(text)}
              color={colors.get('fat')}
              unitSymbol={'g'}
              iconName={'bacon-solid'}
              maxLength={7}
            />
            {/* Carbs */}
            <MacroInputField
              text={carbs}
              onChangeText={(text) => setCarbs(text)}
              color={colors.get('carbohydrates')}
              unitSymbol={'g'}
              iconName={'wheat-solid'}
              maxLength={7}
            />
            {/* Protein */}
            <MacroInputField
              text={protein}
              onChangeText={(text) => setProtein(text)}
              color={colors.get('protein')}
              unitSymbol={'g'}
              iconName={'meat-solid'}
              maxLength={7}
            />
          </View>
          {/* Unit */}
          <View style={styles.unitPickerFlex}>
            <View style={styles.unitIconBox}>
              <IconSVG width={24} name={'ruler-solid'} color={Colors.white} />
              <IconSVG style={styles.unitCaret} color={Colors.violet30} name="caret-down-solid" />
            </View>
            <UnitPicker units={units} onChange={(unit) => setSelectedUnit(unit)} />
          </View>
        </View>
        {/* Quantity & Calories */}
        <View spread gap-20>
          {/* Calories */}
          <MacroInputField
            text={kcals}
            onChangeText={(text) => setKcals(text)}
            unitSymbol={'kcal'}
            unitIndicatorWidth={60}
            iconName={'ball-pile-solid'}
            maxLength={9}
            placeholder={expectedKcals}
          />
          {/* Measure */}
          <MacroInputField
            text={measure}
            onChangeText={(text) => setMeasure(text)}
            unitSymbol={selectedUnit.symbol}
            unitIndicatorWidth={60}
            iconName={'scale-unbalanced-solid'}
            maxLength={7}
          />
        </View>
        {/* Submit Button */}
        <Button
          style={{ borderRadius: 12 }}
          disabled={validation.status === ValidationStatus.Error}
          label={validation.status === ValidationStatus.Warning ? 'Proceed anyway' : 'Create food'}
          onPress={() => {
            const tempValidationStatus: Validation = validateFoodInputs({
              name,
              existingNames: names,
              kcals,
              expectedKcals,
              measure,
            });

            if (tempValidationStatus.status === ValidationStatus.Valid) {
              // create food
              console.log('food created!');
            } else {
              // show problems
              setValidation(tempValidationStatus);
              console.log(tempValidationStatus);
            }
          }}
        />
        {/* </View> */}
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  unitIconBox: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.violet30,
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  unitCaret: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    right: -20,
    zIndex: 1,
  },
  nameField: {
    backgroundColor: Colors.violet30,
    height: 60,
    borderRadius: 20,
  },
  nameInput: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  container: {
    gap: 20,
    padding: 20,
  },
  unitPickerFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
    width: 128,
    gap: 8,
  },
});
