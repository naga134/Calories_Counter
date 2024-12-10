import { useNavigation } from '@react-navigation/native';
import RotatingCaret from 'components/RotatingCaret';
import { Food } from 'database/types';
import { useEffect, useState } from 'react';
import { Colors, ExpandableSection, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useHeaderHeight } from '@react-navigation/elements';
import { Dimensions, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import IconSVG from './icons/IconSVG';
import AnimatedCircleButton from './AnimatedCircleButton';

type FoodListItemProps = {
  food: Food;
  scrollViewRef: React.RefObject<ScrollView>;
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FoodListItem({ food, scrollViewRef, setScrollEnabled }: FoodListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();
  const screenHeight = Dimensions.get('window').height;

  const [layout, setLayout] = useState(0);

  const extraPadding = useSharedValue(0);

  useEffect(() => {
    setScrollEnabled(!expanded);
    extraPadding.value = withTiming(expanded ? 100 : 0, { duration: 300 }); // animate to 100 or 0 depending on expanded
  }, [expanded]);

  const extraPaddingAnimation = useAnimatedStyle(() => ({ marginBottom: extraPadding.value }));

  // TODO: animate the expansion of the bottom padding to exclude the next element off from sight

  return (
    <Animated.View
      style={extraPaddingAnimation}
      onLayout={(event) => {
        setLayout(event.nativeEvent.layout.y);
      }}>
      <ExpandableSection
        expanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
          // Wait for the expandable section to open completely
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: 0, y: layout - 12, animated: true });
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
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,

            height: screenHeight - headerHeight - 68 - 12 - 56, // Allows this view to take up remaining space when expanded
          }}>
          <ReadItem></ReadItem>
        </View>
      </ExpandableSection>
    </Animated.View>
  );
}

function ReadItem() {
  return (
    <View
      style={{
        flex: 1,

        justifyContent: 'flex-end',
        padding: 20,
        // backgroundColor: 'red'
      }}>
      {/* CRUD BUTTONS */}
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
