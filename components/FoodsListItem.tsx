import { useNavigation } from '@react-navigation/native';
import RotatingCaret from 'components/RotatingCaret';
import { Food } from 'database/types';
import { useEffect, useState } from 'react';
import { Colors, ExpandableSection, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useHeaderHeight } from '@react-navigation/elements';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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

  useEffect(() => {
    setScrollEnabled(!expanded);
  }, [expanded]);

  // TODO: animate the expansion of the bottom padding to exclude the next element off from sight

  return (
    <View
      onLayout={(event) => {
        setLayout(event.nativeEvent.layout.y);
      }}>
      <ExpandableSection
        expanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
          // Wait for the expandable section to open completely
          setTimeout(() => {
            scrollViewRef.current?.scrollTo(layout - 12);
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
            backgroundColor: Colors.violet60,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            height: screenHeight - headerHeight - 68 - 12 - 56, // Allows this view to take up remaining space when expanded
          }}></View>
      </ExpandableSection>
    </View>
  );
}
