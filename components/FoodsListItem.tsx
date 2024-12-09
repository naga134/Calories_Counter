import { useNavigation } from '@react-navigation/native';
import RotatingCaret from 'components/RotatingCaret';
import { Food } from 'database/types';
import { useState } from 'react';
import { Colors, ExpandableSection, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useHeaderHeight } from '@react-navigation/elements';
import { Dimensions } from 'react-native';

export default function FoodListItem({ food }: { food: Food }) {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();
  const screenHeight = Dimensions.get('window').height;

  return (
    <ExpandableSection
      expanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
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
  );
}
