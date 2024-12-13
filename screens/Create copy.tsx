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

  const [selectedUnit, setSelectedUnit] = useState({ label: 'aa', value: 0 });

  return (
    <>
      <View
        style={{
          width: '120%',
          // top: 0,
          // position: 'static',
          backgroundColor: Colors.violet30,
          // maxHeight: 40,
          // minHeight: 40,
          height: 52,
          // marginBottom: 40,
        }}></View>
      <View
        style={{
          flex: 1,
          padding: 20,
          gap: 12,
          height: '100%',
          alignItems: 'center',
          // marginTop: 100,
        }}>
        {/* FOOD NAME */}

        {/* <View
        style={{
          flex: 1,
          maxHeight: 56,
          flexDirection: 'row',
          alignItems: 'center',
        }}> */}
        {/* <View
          style={{
            height: 40,
            width: 60,

            // aspectRatio: 1,
            backgroundColor: Colors.violet30,
            justifyContent: 'center',
            alignItems: 'center',
            // borderRadius: 16,
            // borderBottomRightRadius: 0,
          }}>
          <IconSVG width={32} name={'input-text-regular'} color={Colors.white} />
        </View> */}
        {/* <View
       
        }}></View> */}
        {/* </View> */}

        {/* BASE MEASURE */}

        <View
          style={{
            flex: 1,
            maxHeight: 56,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              width: 56,
              aspectRatio: 1,
              backgroundColor: Colors.violet30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 16,
              borderBottomRightRadius: 0,
            }}>
            <IconSVG width={36} name={'scale-unbalanced-solid'} color={Colors.white} />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.grey60,
              maxHeight: 40,
              minHeight: 40,
            }}></View>
          <View
            style={{
              backgroundColor: Colors.grey60,
              height: 40,
              width: 92,
              justifyContent: 'center',
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}>
            <Text grey40 center style={{ fontSize: 18 }}>
              {/* grams */}
              {units.find((unit) => unit.value === selectedUnit)?.label}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            maxHeight: 56,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              width: 48,
              height: 40,
              // aspectRatio: 1,
              backgroundColor: Colors.violet30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 16,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}>
            <IconSVG width={24} name={'ball-pile-solid'} color={Colors.white} />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.grey60,
              maxHeight: 40,
              minHeight: 40,
              justifyContent: 'center',
              paddingRight: 12,
              paddingLeft: 24,
            }}>
            <Text grey40 center style={{ fontSize: 18 }}>
              90.000,00
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.grey60,
              height: 40,
              justifyContent: 'center',
              paddingRight: 20,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}>
            <Text grey40 center style={{ fontSize: 18 }}>
              kcal
            </Text>
          </View>
        </View>

        {/* MACROS */}
        <View style={{ flexDirection: 'row', width: '100%', flex: 1 }}>
          <View style={{ width: '50%', height: '100%', backgroundColor: Colors.grey40 }}></View>
          {/* MEASUREMENT UNIT */}

          <View style={{ flex: 1, backgroundColor: Colors.grey10 }}></View>

          {/* <View
            style={
              {
                flex: 1,
                width: '100%',
                marginTop: 36,
                maxHeight: 56,
                flexDirection: 'row',
                gap: 18,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }
            }>
            <View
              style={{
                width: 44,
                aspectRatio: 1,
                backgroundColor: Colors.violet30,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 16,
                // borderBottomRightRadius: 0,
              }}>
              <IconSVG
                // style={{ transform: [{ rotate: '360deg' }] }}
                width={28}
                name={'ruler-solid'}
                color={Colors.white}
              />
            </View>
          </View>

          <View style={{ height: 48, width: 80 }}>
            <UnitPicker
              onChange={(value) => setSelectedUnit(value)}
              units={units}
              showIndicator
              flipIndicator
            />
          </View> */}
        </View>

        {/* TEXT AREA */}

        {/* CONFIRM BUTTON */}

        <View
          style={{
            // flex: 1,

            // position: 'absolute', bottom: 20,

            width: '100%',
          }}>
          {/* <View
            style={{
              backgroundColor: Colors.grey60,
              height: 140,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
            }}></View> */}
          <Button
            style={{ borderRadius: 8, borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
            label={'Create'}
          />
        </View>
      </View>
    </>
  );
}

// {['bacon-solid', 'meat-solid', 'wheat-solid'].map((string) => (
//   // Whole thing
//   <View
//     key={string}
//     style={{
//       flex: 1,
//       flexDirection: 'row',
//     }}>
//     {/* Icon */}
//     <View
//       style={{
//         width: 48,
//         height: 40,
//         backgroundColor: Colors.violet30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 16,
//         borderTopRightRadius: 0,
//         borderBottomRightRadius: 0,
//       }}>
//       <IconSVG width={24} name={string} color={Colors.white} />
//     </View>
//     {/* Text Holder */}
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: Colors.grey60,
//         maxHeight: 40,
//         minHeight: 40,
//         justifyContent: 'center',
//         paddingHorizontal: 12,
//       }}>
//       <Text grey40 center style={{ fontSize: 18 }}>
//         90.000,00
//       </Text>
//     </View>
//     {/* Unit Indicator */}
//     <View
//       style={{
//         backgroundColor: Colors.grey60,
//         height: 40,
//         justifyContent: 'center',
//         paddingRight: 12,
//         borderTopRightRadius: 8,
//         borderBottomRightRadius: 8,
//       }}>
//       <Text grey40 center style={{ fontSize: 18 }}>
//         g
//       </Text>
//     </View>
//   </View>
// ))}
