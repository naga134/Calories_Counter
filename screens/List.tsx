import getAllFoods from 'database/queries/foodsQueries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import FoodListItem from 'components/FoodsListItem';
import { Colors, TextField, View } from 'react-native-ui-lib';
import IconSVG from 'components/icons/IconSVG';
import { RootStackParamList } from 'navigation/index';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Easing,
  withDelay,
} from 'react-native-reanimated';

import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Meal } from 'database/types';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = StaticScreenProps<{
  title: string;
}>;

export default function FoodsList({ route }: Props) {
  const database: SQLiteDatabase = useSQLiteContext();
  const queryClient: QueryClient = useQueryClient();

  // Retrieving the list of daily meals from the database
  const { data: foods = [] } = useQuery({
    queryKey: ['foods'],
    queryFn: () => getAllFoods(database),
    initialData: [],
  });

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          gap: 12,
          // Necessary to not cover the list items with the search bar
          paddingBottom: 68,
        }}>
        {foods.map((food) => (
          <FoodListItem key={food.id} food={food} />
        ))}
      </ScrollView>
      <BottomBar />
    </>
  );
}

function BottomBar() {
  // useNavigation<StackNavigationProp<RootStackParamList>>
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [expanded, setExpanded] = useState(false);
  const screenWidth = Dimensions.get('window').width;

  const animation1 = useSharedValue(0);
  const animation2 = useSharedValue(0);

  useEffect(() => {
    const toValue = expanded ? 1 : 0;
    const config = {
      duration: 600,
      easing: Easing.inOut(Easing.cubic),
    };

    if (expanded) {
      // If it is not yet expanded, run animation1 first, then animation2.
      animation1.value = withTiming(toValue, config);
      animation2.value = withDelay(300, withTiming(toValue, config));
    } else {
      // If it is already expanded, run animation2 first, then animation1.
      animation2.value = withTiming(toValue, config);
      animation1.value = withDelay(500, withTiming(toValue, config));
    }
  }, [expanded, animation1, animation2]);

  // Constructing animated styles:

  const searchButtonAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animation1.value, [0, 1], [0, 360]);

    return {
      right: interpolate(animation1.value, [0, 1], [64, 8]),
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const addButtonAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animation1.value, [0, 1], [0, 180]);

    return {
      right: interpolate(animation1.value, [0, 1], [8, -48]),
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const bottomBarAnimatedStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(animation2.value, [0, 1], [0, 100]);

    return {
      width: interpolate(animation2.value, [0, 1], [0, screenWidth - 16]),
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
      right: interpolate(
        animation2.value,
        [0, 1],
        [32 /* half the button's length + padding */, 8]
      ),
    };
  });

  // Component itself:

  return (
    <View style={{ position: 'relative' }}>
      {/* Search Bar */}
      <Animated.View style={[styles.bottomBar, bottomBarAnimatedStyle]}>
        <TextField
          textAlign={'center'}
          textAlignVertical={'center'}
          style={[styles.textField, { width: screenWidth - 104 }]}
          placeholder={'Search for a food!'}
          placeholderTextColor={Colors.white}
        />
      </Animated.View>
      {/* Magnifying Glass Search Button */}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Animated.View style={[styles.searchButton, searchButtonAnimatedStyle]}>
          <IconSVG
            style={{ margin: 'auto' }}
            name="magnifying-glass-solid"
            width={20}
            color={Colors.white}
          />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Create')}>
        <Animated.View style={[styles.addFoodButton, addButtonAnimatedStyle]}>
          <IconSVG style={{ margin: 'auto' }} name="plus-solid" width={20} color={Colors.white} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: Colors.violet30,
    height: 48,
    bottom: 8,
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 100,
  },
  textField: {
    color: Colors.white,
    fontSize: 18,
    height: 32,
    paddingRight: 20,
  },
  searchButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    height: 48,
    width: 48,
    borderRadius: '100%',
    backgroundColor: Colors.violet30,
  },
  addFoodButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    height: 48,
    width: 48,
    borderRadius: '100%',
    backgroundColor: Colors.violet30,
  },
});
