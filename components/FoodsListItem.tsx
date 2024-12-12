import { useNavigation } from '@react-navigation/native';
import RotatingCaret from 'components/RotatingCaret';
import { Food, Nutritable } from 'database/types';
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
import FoodDetails from './FoodDetails';
import getNutritables from 'database/queries/nutritablesQueries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useQuery } from '@tanstack/react-query';

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
  // Fetching
  const database: SQLiteDatabase = useSQLiteContext();

  const { data: nutritables = [], isFetched } = useQuery({
    queryKey: [`nutritables_${food.id}`],
    queryFn: () => getNutritables(database, { foodId: food.id }),
    initialData: [],
  });

  // TODO: Apply loading effect while data is loading

  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();
  const screenHeight = Dimensions.get('window').height;
  const extraPadding = useSharedValue(0);

  useEffect(() => {
    setScrollEnabled(!expanded);
    extraPadding.value = withTiming(expanded ? 208 : 0, { duration: 300 }); // animate to 100 or 0 depending on expanded
  }, [expanded]);

  const extraPaddingAnimation = useAnimatedStyle(() => ({ marginBottom: extraPadding.value }));

  return (
    <Animated.View
    // style={extraPaddingAnimation}
    >
      <ExpandableSection
        expanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
          // Wait for the expandable section to open completely
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: index, viewOffset: 12 });
          }, 200);
        }}
        sectionHeader={<ExpandableSectionHeader food={food} expanded={expanded} />}>
        {!isFetched ? <></> : <ExpandableSectionBody food={food} nutritables={nutritables} />}
      </ExpandableSection>
    </Animated.View>
  );
}

function ExpandableSectionHeader({ food, expanded }: { food: Food; expanded: boolean }) {
  return (
    <View
      key={food.id}
      style={[
        styles.headerStyle,
        {
          borderBottomLeftRadius: expanded ? 0 : 10,
          borderBottomRightRadius: expanded ? 0 : 10,
        },
      ]}>
      <Text style={{ fontSize: 18 }}>{food.name}</Text>
      <RotatingCaret size={16} rotated={expanded} color={Colors.grey20} />
    </View>
  );
}

function ExpandableSectionBody({ food, nutritables }: { food: Food; nutritables: Nutritable[] }) {
  return (
    <View style={styles.cardBackground}>
      <FoodDetails food={food} nutritables={nutritables} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 56,
    backgroundColor: Colors.white,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBackground: {
    backgroundColor: Colors.grey80,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: '100%',
    backgroundColor: Colors.violet30,
  },
});
