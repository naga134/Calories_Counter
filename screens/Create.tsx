import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getAllFoodNames } from 'database/queries/foodsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { useLayoutEffect, useState } from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
import { Dimensions, StyleSheet } from 'react-native';
import { Button, Colors, Text, TextArea, View } from 'react-native-ui-lib';
import IconSVG from 'components/icons/IconSVG';
import RotatingCaret from 'components/RotatingCaret';
import UnitPicker from 'components/UnitPicker';

export default function Create() {
  const database = useSQLiteContext();

  const navigation = useNavigation();

  const { data: names = [] } = useQuery({
    queryKey: ['foodnames'],
    queryFn: () => getAllFoodNames(database),
    initialData: [],
  });

  console.log(names);

  const [pickerValue, setPickerValue] = useState('a');

  const screenWidth = Dimensions.get('window').width;

  const units = [
    { label: 'g', value: '1' },
    { label: 'oz', value: '2' },
    { label: 'tsp', value: '3' },
    { label: 'tbsp', value: '4' },
    { label: 'ml', value: '5' },
  ];

  const [selectedUnit, setSelectedUnit] = useState(units[0]);

  return (
    <>
      {/* Name banner */}
      <View
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: Colors.violet30,
          maxHeight: 52,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 60,
        }}>
        <Text style={{ color: 'white', fontSize: 20 }}>New Food</Text>
        <IconSVG
          style={{ position: 'absolute', right: 12 }}
          name="feather-pointed-solid"
          color="white"
        />
      </View>
      <View style={{ flex: 1, gap: 12, padding: 20 }}>
        {/* Base Measure */}
        <MacroInputField
          opticallyAdjustText
          iconName={'scale-unbalanced-solid'}
          unitSymbol={selectedUnit.label}
          renderUnitIndicator={(unitSymbol) => (
            <View style={styles.specialInputFieldUnitIndicator}>
              <Text style={styles.inputFieldText}>{unitSymbol}</Text>
            </View>
          )}
        />
        {/* Calories */}
        <MacroInputField
          opticallyAdjustText
          iconName={'ball-pile-solid'}
          unitSymbol={'kcal'}
          renderUnitIndicator={(unitSymbol) => (
            <View style={styles.specialInputFieldUnitIndicator}>
              <Text style={styles.inputFieldText}>{unitSymbol}</Text>
            </View>
          )}
        />
        {/* <View style={{ flex: 1, backgroundColor: 'pink', maxHeight: 40 }}></View> */}
        {/* Macros & Unit BOX*/}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            gap: 12,
            maxHeight: 40 /* textInputs' heights */ * 3 + 12 /* gap */ * 2,
          }}>
          {/* Macros BOX */}
          <View style={{ flex: 1, gap: 12, justifyContent: 'space-between' }}>
            {/* Fat */}
            <MacroInputField iconName={'bacon-solid'} unitSymbol={'g'} />
            {/* Carbs */}
            <MacroInputField iconName={'wheat-solid'} unitSymbol={'g'} />
            {/* Protein */}
            <MacroInputField iconName={'meat-solid'} unitSymbol={'g'} />
          </View>
          {/* Unit BOX*/}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              gap: 12,
              maxWidth: 44 + 12 + 80,
            }}>
            {/* Icon BOX */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              {/* Icon */}
              <View
                style={{
                  backgroundColor: Colors.violet30,
                  width: 44,
                  aspectRatio: 1,
                  borderRadius: 16,
                }}>
                <IconSVG name="ruler-solid" color="white" style={{ margin: 'auto' }} />
              </View>
            </View>
            {/* Unit picker BOX */}
            <View
              style={{
                flex: 1,
              }}>
              <UnitPicker
                units={units}
                flipIndicator
                showIndicator
                onChange={(value) => setSelectedUnit(units.find((unit) => unit.value === value))}
                backgroundColor={Colors.grey60}
                activeTextColor={Colors.violet30}
                inactiveTextColor={Colors.grey40}
              />
            </View>
          </View>
        </View>
        {/* Button & Warnings */}
        <View style={{ flex: 1, gap: 12, justifyContent: 'flex-end' }}>
          {/* Info box */}
          <View
            style={{
              // flex: 1,
              // maxHeight: '50%',
              backgroundColor: Colors.violet70,
              // justifyContent: 'flex-end',
              borderRadius: 16,
              padding: 20,
            }}>
            <Text grey10 style={{ textAlign: 'justify', fontSize: 16 }}>
              Each <Text violet30>{selectedUnit.label}</Text> of <Text violet30>FOOD_NAME</Text>{' '}
              contains <Text violet30>0.00kcal</Text>, <Text violet30>0.00g</Text> of protein,{' '}
              <Text violet30>0.00g</Text> of carbohydrates and <Text violet30>0.00g</Text> of fat.
            </Text>
          </View>
          {/* "Create" Button */}
          <Button style={{ borderRadius: 12 }} label={'Create'} />
        </View>
      </View>
    </>
  );
}

const DefaultUnitIndicator: React.FC<{ unitSymbol: string }> = ({ unitSymbol }) => (
  <View style={styles.inputFieldUnitIndicator}>
    <Text style={styles.inputFieldText}>{unitSymbol}</Text>
  </View>
);

interface MacroInputFieldProps {
  unitSymbol: string;
  renderUnitIndicator?: (unitSymbol: string) => React.ReactNode;
  iconName:
    | 'bacon-solid'
    | 'meat-solid'
    | 'wheat-solid'
    | 'ball-pile-solid'
    | 'scale-unbalanced-solid';
  opticallyAdjustText?: boolean;
}

const MacroInputField: React.FC<MacroInputFieldProps> = ({
  unitSymbol,
  renderUnitIndicator, // Assign default if not provided
  iconName,
  opticallyAdjustText,
}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        maxHeight: 40,
      }}>
      {/* Icon */}
      <View style={styles.inputFieldIcon}>
        <IconSVG width={24} name={iconName} color={Colors.white} style={{ margin: 'auto' }} />
      </View>
      {/* Input Field */}
      <View style={styles.inputField}>
        <Text style={[styles.inputFieldText, opticallyAdjustText && { marginLeft: 24 }]}>0.00</Text>
      </View>
      {/* Unit indicator */}
      {renderUnitIndicator ? (
        renderUnitIndicator(unitSymbol)
      ) : (
        <DefaultUnitIndicator unitSymbol={unitSymbol} />
      )}
    </View>
  );
};

const baseStyles = StyleSheet.create({
  unitIndicatorBase: {
    height: '100%',
    backgroundColor: Colors.grey60,
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    // paddingRight: 12,
  },
});

const styles = StyleSheet.create({
  inputFieldIcon: {
    height: '100%',
    width: 44,
    backgroundColor: Colors.violet30,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  inputField: {
    flex: 1,
    backgroundColor: Colors.grey60,
    justifyContent: 'center',
  },
  inputFieldUnitIndicator: {
    ...baseStyles.unitIndicatorBase,
    paddingRight: 12,
  },
  specialInputFieldUnitIndicator: {
    ...baseStyles.unitIndicatorBase,
    width: 60,
  },
  inputFieldText: {
    fontSize: 18,
    color: Colors.grey40,
    textAlign: 'center',
  },
});

// const specialStyles = StyleSheet.create({
//   specialInputFieldUnitIndicator: {
//     ...styles.inputFieldUnitIndicator,
//   },
// });
