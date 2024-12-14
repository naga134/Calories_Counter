import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getAllFoodNames } from 'database/queries/foodsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import IconSVG from 'components/icons/IconSVG';
import UnitPicker from 'components/UnitPicker';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import CustomNumberInput from 'components/CustomNumberInput';
import { getAllUnits } from 'database/queries/unitsQueries';
import { validateFoodInputs, ValidationError } from 'utils/validateFood';

export default function Create() {
  const database = useSQLiteContext();
  const navigation = useNavigation();

  // Retrieving all the current foods names for validation: names must be unique.
  const { data: names = [], isFetched: namesFetched } = useQuery({
    queryKey: ['foodnames'],
    queryFn: () => getAllFoodNames(database),
    initialData: [],
  });

  // Retrieving all possible measurement units.
  const { data: units = [], isFetched: unitsFetched } = useQuery({
    queryKey: ['allUnits'],
    queryFn: () => getAllUnits(database),
    initialData: [],
  });

  // Declaring the stateful variable which will hold the currently selected unit's id.
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  // Initializing the currently selected unit as soon as the units have been fetched.
  useEffect(() => {
    if (unitsFetched && units.length > 0 && selectedUnitId === null) {
      setSelectedUnitId(units[0].id);
    }
  }, [units, unitsFetched]);

  // Food's DATA:
  const [name, setName] = useState('');
  const [measure, setMeasure] = useState('');
  const [kcals, setKcals] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const selectedUnit = useMemo(() => {
    return units.find((unit) => unit.id === selectedUnitId);
  }, [units, selectedUnitId]);

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [validated, setValidated] = useState<boolean>(false);

  useEffect(() => {
    setValidated(false);
  }, [name, measure, kcals, protein, carbs, fat]);

  // COMPONENT
  return !unitsFetched || selectedUnit === null || selectedUnit === undefined ? (
    <></>
  ) : (
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
          // paddingHorizontal: 60,
        }}>
        {/* Name Input Field */}
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          textAlign="center"
          style={{
            color: 'white',
            fontSize: 20,
            flex: 1,
            width: '100%',
            paddingHorizontal: 60,
          }}
          placeholder="New Food"
          placeholderTextColor={Colors.violet40}
        />
        {/* <Text >New Food</Text> */}
        <IconSVG
          style={{ position: 'absolute', right: 12 }}
          name="feather-pointed-solid"
          color="white"
        />
      </View>
      <View style={{ flex: 1, gap: 12, padding: 20 }}>
        {/* Base Measure */}
        <MacroInputField
          value={measure ?? ''}
          setValue={setMeasure}
          maxLength={7}
          opticallyAdjustText
          iconName={'scale-unbalanced-solid'}
          unitSymbol={selectedUnit?.symbol}
          renderUnitIndicator={(unitSymbol) => (
            <View style={styles.specialInputFieldUnitIndicator}>
              <Text style={styles.inputFieldUnitIndicatorText}>{unitSymbol}</Text>
            </View>
          )}
        />
        {/* Calories */}
        <MacroInputField
          value={kcals ?? ''}
          setValue={setKcals}
          maxLength={9}
          opticallyAdjustText
          iconName={'ball-pile-solid'}
          unitSymbol={'kcal'}
          renderUnitIndicator={(unitSymbol) => (
            <View style={styles.specialInputFieldUnitIndicator}>
              <Text style={styles.inputFieldUnitIndicatorText}>{unitSymbol}</Text>
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
            <MacroInputField
              value={fat ?? ''}
              setValue={setFat}
              iconName={'bacon-solid'}
              unitSymbol={'g'}
            />
            {/* Carbs */}
            <MacroInputField
              value={carbs ?? ''}
              setValue={setCarbs}
              iconName={'wheat-solid'}
              unitSymbol={'g'}
            />
            {/* Protein */}
            <MacroInputField
              value={protein ?? ''}
              setValue={setProtein}
              iconName={'meat-solid'}
              unitSymbol={'g'}
            />
          </View>
          {/* Unit BOX*/}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              gap: 12,
              maxWidth: 44 + 12 + 80,
              minHeight: 40 * 3 + 12 * 2,
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
                onChange={(unitId: number) => setSelectedUnitId(unitId)}
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
          <ScrollView
            horizontal
            style={{
              flex: 1,
              // backgroundColor: Colors.violet60,
              maxHeight: 60,
              gap: 12,
            }}>
            {errors.map((error, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  gap: 12,
                  backgroundColor: error.errorType === 'error' ? Colors.red60 : Colors.orange60,
                  // width: 200,
                  height: '100%',
                  borderRadius: 16,
                  marginLeft: index === 0 ? 0 : 6,
                  marginRight: index === errors.length - 1 ? 0 : 6,
                }}>
                <IconSVG
                  color={error.errorType === 'error' ? Colors.red10 : Colors.orange10}
                  width={40}
                  name="hexagon-exclamation-solid"
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: error.errorType === 'error' ? Colors.red10 : Colors.orange10,
                  }}>
                  {error.errorMessage}
                </Text>
              </View>
            ))}
          </ScrollView>
          {/* <View
            style={{
              // flex: 1,
              // maxHeight: '50%',
              backgroundColor: Colors.violet70,
              // justifyContent: 'flex-end',
              borderRadius: 16,
              padding: 20,
            }}>
            <Text grey10 style={{ textAlign: 'justify', fontSize: 16 }}>
              Each <Text violet30>{selectedUnit.symbol}</Text> of{' '}
              <Text violet30>{name === '' ? '<food_name>' : name}</Text> contains:
              <Text violet30>0.00kcal</Text>, <Text violet30>0.00g</Text> of protein,{' '}
              <Text violet30>0.00g</Text> of carbohydrates and <Text violet30>0.00g</Text> of fat.
            </Text>
          </View> */}
          {/* "Create" Button */}
          <Button
            style={{ borderRadius: 12 }}
            label={'Create'}
            disabled={validated && errors.some((error) => error.errorType === 'error')}
            onPress={() => {
              const errors = validateFoodInputs(name, measure, kcals, protein, carbs, fat, names);

              if (errors.length === 0) {
                // proceed with creation
              } else {
                setErrors(errors);
                setValidated(true);
              }
            }}
          />
        </View>
      </View>
    </>
  );
}

const DefaultUnitIndicator: React.FC<{ unitSymbol: string }> = ({ unitSymbol }) => (
  <View style={styles.inputFieldUnitIndicator}>
    <Text style={styles.inputFieldUnitIndicatorText}>{unitSymbol}</Text>
  </View>
);

interface MacroInputFieldProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  maxLength?: number; // Can I enforce this to be an integer somehow?
  unitSymbol: string;
  renderUnitIndicator?: (unitSymbol: string) => React.ReactNode;
  iconName:
    | 'bacon-solid'
    | 'meat-solid'
    | 'wheat-solid'
    | 'ball-pile-solid'
    | 'scale-unbalanced-solid';
  // This adjust the centering of the textInput for the longer (kcals & measure) fields
  opticallyAdjustText?: boolean;
}

const MacroInputField: React.FC<MacroInputFieldProps> = ({
  value,
  setValue,
  maxLength,
  unitSymbol,
  renderUnitIndicator,
  iconName,
  opticallyAdjustText,
}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        maxHeight: 40,
        minHeight: 40,
      }}>
      {/* Icon */}
      <View style={styles.inputFieldIcon}>
        <IconSVG width={24} name={iconName} color={Colors.white} style={{ margin: 'auto' }} />
      </View>
      {/* Input Field */}
      <View style={styles.inputField}>
        <CustomNumberInput
          maxLength={maxLength}
          value={value}
          setValue={setValue}
          style={[styles.inputFieldTextInput, opticallyAdjustText && { marginLeft: 24 }]}
        />
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
    color: Colors.grey40,
  },
  inputFieldTextBase: {
    flex: 1,
    fontSize: 18,
    color: Colors.grey40,
    textAlign: 'center',
    textAlignVertical: 'center',
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
  },
  inputFieldUnitIndicator: {
    ...baseStyles.unitIndicatorBase,
    paddingRight: 12,
  },
  specialInputFieldUnitIndicator: {
    ...baseStyles.unitIndicatorBase,
    width: 60,
  },
  inputFieldUnitIndicatorText: {
    ...baseStyles.inputFieldTextBase,
    color: Colors.grey40,
  },
  inputFieldTextInput: {
    ...baseStyles.inputFieldTextBase,
    color: Colors.violet30,
  },
});
