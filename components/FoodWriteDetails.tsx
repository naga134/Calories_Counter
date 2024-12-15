import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getAllFoodNames } from 'database/queries/foodsQueries';
import { SQLiteRunResult, useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import IconSVG from 'components/icons/IconSVG';
import UnitPicker from 'components/UnitPicker';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import CustomNumberInput from 'components/CustomNumberInput';
import { validateFoodInputs, ValidationError } from 'utils/validateFood';
import { useHeaderHeight } from '@react-navigation/elements';
import calculateCalories from 'utils/calculateCalories';
import { Unit } from 'database/types';

type FoodWriteDetailsProps = {
  disableNameEdit?: boolean;
  currentName?: string;
  measure: string;
  setMeasure: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  kcals: string;
  setKcals: React.Dispatch<React.SetStateAction<string>>;
  protein: string;
  setProtein: React.Dispatch<React.SetStateAction<string>>;
  carbs: string;
  setCarbs: React.Dispatch<React.SetStateAction<string>>;
  fat: string;
  setFat: React.Dispatch<React.SetStateAction<string>>;
  units: Unit[];
  selectedUnitId: number | null;
  setSelectedUnitId: React.Dispatch<React.SetStateAction<number | null>>;
  queryRunnerFunction: () => void;
};

export default function FoodWriteDetails({
  currentName,
  name,
  setName,
  measure,
  setMeasure,
  kcals,
  setKcals,
  protein,
  setProtein,
  carbs,
  setCarbs,
  fat,
  setFat,
  selectedUnitId,
  setSelectedUnitId,
  units,
  queryRunnerFunction,
  disableNameEdit,
}: FoodWriteDetailsProps) {
  const database = useSQLiteContext();
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const headerHeight = useHeaderHeight();

  const [expectedKcals, setExpectedKcals] = useState('0.00');
  useEffect(() => {
    setExpectedKcals(
      calculateCalories(Number(protein), Number(carbs), Number(fat)).toFixed(2).toString()
    );
  }, [protein, carbs, fat]);

  const selectedUnit = useMemo(() => {
    return units.find((unit) => unit.id === selectedUnitId);
  }, [units, selectedUnitId]);

  //// VALIDATION
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [validated, setValidated] = useState<boolean>(false);
  // Retrieving all names for validation purposes: names must be unique.
  const { data: names = [], isFetched: namesFetched } = useQuery({
    queryKey: ['foodnames'],
    queryFn: () => getAllFoodNames(database),
    initialData: [],
  });

  useEffect(() => {
    setValidated(false);
  }, [name, measure, kcals, protein, carbs, fat]);

  // COMPONENT
  return (
    <>
      {/* Name banner */}
      <KeyboardAvoidingView style={{ height: screenHeight - headerHeight }}>
        <View
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: Colors.violet30,
            maxHeight: 52,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Name Input Field */}
          <TextInput
            editable={!disableNameEdit}
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
          {!disableNameEdit && (
            <IconSVG
              style={{ position: 'absolute', right: 12 }}
              name="feather-pointed-solid"
              color="white"
            />
          )}
        </View>
        {/* Whole thing */}
        <View
          style={{
            flex: 1,
            gap: 12,
            padding: 20,
            position: 'relative',
          }}>
          {/* Base Measure */}
          <MacroInputField
            value={measure ?? ''}
            setValue={setMeasure}
            maxLength={7}
            opticallyAdjustText
            iconName={'scale-unbalanced-solid'}
            unitSymbol={selectedUnit!.symbol}
            renderUnitIndicator={(unitSymbol) => (
              <View style={styles.specialInputFieldUnitIndicator}>
                <Text style={styles.inputFieldUnitIndicatorText}>{unitSymbol}</Text>
              </View>
            )}
          />
          {/* Calories */}
          <MacroInputField
            placeholder={expectedKcals}
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
          <View style={{ flex: 1, gap: 12, position: 'absolute', bottom: 0 }}>
            {/* Info box */}
            <ScrollView
              horizontal
              style={{
                marginLeft: 20,
                height: 60,
              }}>
              {errors.map((error, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    gap: 12,
                    borderRadius: 16,
                    backgroundColor: error.errorType === 'error' ? Colors.red60 : Colors.orange60,
                    marginLeft: index === 0 ? 0 : 6,
                    marginRight: index === errors.length - 1 ? 0 : 6,
                  }}>
                  <IconSVG
                    color={error.errorType === 'error' ? Colors.red10 : Colors.orange10}
                    width={40}
                    name={
                      error.errorType === 'error'
                        ? 'hexagon-exclamation-solid'
                        : 'triangle-exclamation-solid'
                    }
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
            {/* "Create" Button */}
            <Button
              style={{
                borderRadius: 12,
                width: screenWidth - 40,
                marginBottom: 20,
                marginLeft: 20,
              }}
              label={'Create'}
              disabled={validated && errors.some((error) => error.errorType === 'error')}
              onPress={() => {
                const errors = validateFoodInputs(
                  name,
                  measure,
                  // If no calories are informed, proceed with the placeholder value.
                  kcals === '' ? expectedKcals : kcals,
                  protein,
                  carbs,
                  fat,
                  names.filter((name) => name !== currentName)
                );
                setErrors(errors);

                const thereAreErrors = errors.some((error) => error.errorType === 'error');
                const thereAreWarnings = errors.some((error) => error.errorType === 'warning');

                if (
                  (!thereAreErrors && !thereAreWarnings) ||
                  (!thereAreErrors && thereAreWarnings && validated)
                ) {
                  queryRunnerFunction();
                } else {
                  setValidated(true);
                }
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  placeholder?: string;
}

const MacroInputField: React.FC<MacroInputFieldProps> = ({
  value,
  setValue,
  maxLength,
  unitSymbol,
  renderUnitIndicator,
  iconName,
  opticallyAdjustText,
  placeholder = '0.00',
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
          placeholder={placeholder}
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
    padding: 0,
  },
});
