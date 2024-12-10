import { useNavigation } from '@react-navigation/native';
import RotatingCaret from 'components/RotatingCaret';
import { Food } from 'database/types';
import { useEffect, useState } from 'react';
import {
  Colors,
  ExpandableSection,
  Picker,
  Text,
  TextField,
  TouchableOpacity,
  View,
  WheelPicker,
} from 'react-native-ui-lib';

// import WheelPicker from '@quidone/react-native-wheel-picker';
import { useHeaderHeight } from '@react-navigation/elements';
import { Dimensions, StyleSheet } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import IconSVG from './icons/IconSVG';
import AnimatedCircleButton from './AnimatedCircleButton';
import { useColors } from 'context/ColorContext';

type FoodListItemProps = {
  food: Food;
  index: number;
  scrollViewRef: React.RefObject<FlatList>;
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FoodListItem({
  food,
  index,
  scrollViewRef: flatListRef,
  setScrollEnabled,
}: FoodListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();
  const screenHeight = Dimensions.get('window').height;

  const [layout, setLayout] = useState(0);

  const extraPadding = useSharedValue(0);

  useEffect(() => {
    setScrollEnabled(!expanded);
    extraPadding.value = withTiming(expanded ? 208 : 0, { duration: 300 }); // animate to 100 or 0 depending on expanded
  }, [expanded]);

  const extraPaddingAnimation = useAnimatedStyle(() => ({ marginBottom: extraPadding.value }));

  // TODO: animate the expansion of the bottom padding to exclude the next element off from sight

  return (
    <Animated.View
      // style={extraPaddingAnimation}
      onLayout={(event) => {
        setLayout(event.nativeEvent.layout.y);
      }}>
      <ExpandableSection
        expanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
          // Wait for the expandable section to open completely
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: index, viewOffset: 12 });
          }, 200);
        }}
        sectionHeader={
          <View
            key={food.id}
            style={{
              height: 56,
              backgroundColor: Colors.white,
              padding: 15,
              // borderRadius: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: expanded ? 0 : 10,
              borderBottomRightRadius: expanded ? 0 : 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: 18 }}>{food.name}</Text>
            <RotatingCaret size={16} rotated={expanded} color={Colors.grey20} />
          </View>
        }>
        <View
          style={{
            backgroundColor: Colors.grey80,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}>
          <ReadItem></ReadItem>
        </View>
      </ExpandableSection>
    </Animated.View>
  );
}

function ReadItem() {
  const colors = useColors();

  const macroItems = [
    {
      color: colors.get('fat'),
      iconName: 'bacon-solid',
      amount: 0,
      unit: 'g',
      // onPress: () => setFat(fat + 10),
    },
    {
      color: colors.get('carbohydrates'),
      iconName: 'wheat-solid',
      amount: 0,
      unit: 'g',
      // onPress: () => setCarbohydrates(carbohydrates + 10),
    },
    {
      color: colors.get('protein'),
      iconName: 'meat-solid',
      amount: 0,
      unit: 'g',
      // onPress: () => setProtein(protein + 10),
    },
    {
      color: colors.get('calories'),
      iconName: 'ball-pile-solid',
      amount: 0,
      unit: 'g',
      onPress: () => {
        // setProtein(0), setCarbohydrates(0), setFat(0);
      },
    },
  ] as const;

  const data = [...Array(100).keys()].map((index) => ({
    value: index,
    label: index.toString(),
  }));

  const [value, setValue] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    // Whole thing
    <View
      style={{
        flex: 1,
        padding: 20,
        gap: 20,
      }}>
      {/* Macros Overview Section */}
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          backgroundColor: Colors.violet70,
          borderRadius: 20,
          justifyContent: 'space-between',
        }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {macroItems.map((m, i) => (
            // Each Macro Overview
            <View
              key={i}
              style={{
                flex: 1,
                gap: 8,
                backgroundColor: Colors.violet30,
                padding: 8,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
              }}
              // onPress={onPress}
            >
              <IconSVG color={Colors.white} width={28} name={m.iconName} />
              <Text style={{ color: Colors.white, fontSize: 18, fontWeight: 500 }}>0</Text>
            </View>
          ))}
        </View>
      </View>
      {/* Amount and Unit section */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}>
        <View style={{ position: 'relative', flexDirection: 'row', gap: 20 }}>
          {/* Amount Scale */}
          <View
            style={{
              width: '45%',
              padding: 20,
              alignItems: 'center',
              aspectRatio: 1,
              backgroundColor: Colors.violet30,
              borderRadius: 20,
              justifyContent: 'space-between',
            }}>
            <IconSVG name="gauge-solid" color={Colors.violet70} width={32} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IconSVG
                style={{ transform: [{ rotate: '90deg' }] }}
                name="caret-down-solid"
                width={12}
                color={Colors.violet50}
              />
              <TextField
                textAlign={'center'}
                textAlignVertical={'center'}
                placeholderTextColor={Colors.violet30}
                placeholder={`${0}`}
                style={{
                  backgroundColor: Colors.violet70,
                  width: 72,
                  fontSize: 18,
                  borderRadius: 8,
                  height: 32,
                  color: Colors.violet20,
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
          {/* wheel picker */}
          <View
            style={{
              backgroundColor: Colors.violet70,
              borderRadius: 16,
              justifyContent: 'center',
              position: 'relative',
              width: 'auto',
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
                // transform: [{ rotate: '225deg' }],
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
              items={[
                { label: 'ml', value: 'ml' },
                { label: 'oz', value: 'oz' },
                { label: 'g', value: 'g' },
              ]}
              initialValue={'yes'}
              onChange={(value) => console.log(value)}
              faderProps={{ size: 0 }}
            />
          </View>
        </View>
      </View>
      {/* Action buttons section */}
      <View
        style={{
          justifyContent: 'center',
          gap: 12,
          backgroundColor: Colors.violet70,
          paddingBottom: 12,
          paddingTop: 12,

          borderRadius: 24,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <AnimatedCircleButton
            onPress={() => {}}
            buttonStyle={styles.buttonStyle}
            iconProps={{
              style: { marginLeft: 6 },
              name: 'solid-square-list-pen',
              width: 32,
              color: Colors.white,
            }}
          />
          <AnimatedCircleButton
            onPress={() => {}}
            buttonStyle={styles.buttonStyle}
            iconProps={{
              style: { marginLeft: 3 },
              name: 'solid-square-list-circle-xmark',
              width: 32,
              color: Colors.white,
            }}
          />
          <AnimatedCircleButton
            onPress={() => {}}
            buttonStyle={styles.buttonStyle}
            iconProps={{
              style: { marginLeft: 3 },
              name: 'solid-square-list-circle-plus',
              width: 32,
              color: Colors.white,
            }}
          />
          <AnimatedCircleButton
            onPress={() => {}}
            buttonStyle={styles.buttonStyle}
            iconProps={{
              name: 'utensils-solid',
              style: { marginRight: 1 },
              width: 26,
              color: Colors.white,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: '100%',
    backgroundColor: Colors.violet30,
  },
});
