import { getAllFoods } from 'database/queries/foodsQueries';
import { addDatabaseChangeListener, SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { FlatList, Pressable, ScrollView } from 'react-native-gesture-handler';
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
  cancelAnimation,
  interpolateColor,
} from 'react-native-reanimated';

import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { StackActions, StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Meal } from 'database/types';
import { StackNavigationProp } from '@react-navigation/stack';
import AnimatedCircleButton from 'components/AnimatedCircleButton';

type Props = StaticScreenProps<{
  title: string;
}>;

export default function FoodsList({ route }: Props) {
  const database: SQLiteDatabase = useSQLiteContext();

  // Retrieving the list of daily meals from the database
  const {
    data: foods = [],
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ['foods'],
    queryFn: () => getAllFoods(database),
    initialData: [],
  });

  useEffect(() => {
    const listener = addDatabaseChangeListener((change) => {
      if (change.tableName === 'foods') refetch();
    });

    return () => {
      listener.remove();
    };
  }, []);

  const scrollViewRef = useRef<FlatList>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Creating stateful variable to hold the user's search string.
  const [searchParams, setSearchParams] = useState('');

  // Returning only the foods that match the user's search string.
  const searchResults = foods.filter((food) =>
    food.name.toLowerCase().includes(searchParams.toLowerCase())
  );

  // TODO: Apply LOADING effect while data is fetching or refetching

  return (
    <>
      <FlatList
        ref={scrollViewRef}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{
          padding: 20,
          gap: 12,
          // Necessary to not cover the list items with the search bar
          paddingBottom: 68,
        }}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index)}
        data={searchResults}
        renderItem={({ item: food, index: index }) => {
          return (
            // searchResults.some((result) => result.id === food.id) && (
            <FoodListItem
              food={food}
              index={index}
              scrollViewRef={scrollViewRef}
              setScrollEnabled={setScrollEnabled}
            />
            // )
          );
        }}
      />
      <BottomBar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        disabled={!scrollEnabled}
      />
    </>
  );
}

interface BottomBarProps {
  disabled?: boolean; // Optional boolean indicating if the bottom bar is disabled
  searchParams: string; // The current search string
  setSearchParams: React.Dispatch<React.SetStateAction<string>>; // State updater function for searchParams
}

function BottomBar({ disabled, searchParams, setSearchParams }: BottomBarProps) {
  // useNavigation<StackNavigationProp<RootStackParamList>>
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [expanded, setExpanded] = useState(false);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // If bottom bar becomes disabled while expanded, de-expand it
    if (disabled && expanded) {
      setExpanded(false);
    }

    if (searchParams !== '' && !expanded && !disabled) {
      setExpanded(true);
    }
  }, [disabled, expanded, searchParams]);

  const rollAnim = useSharedValue(0);
  const expandAnim = useSharedValue(0);
  const disabledAnim = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    disabledAnim.value = withTiming(disabled ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [disabled]);

  useEffect(() => {
    const toValue = expanded ? 1 : 0;
    const config = {
      duration: 600,
      easing: Easing.inOut(Easing.cubic),
    };

    if (expanded) {
      // If it is not yet expanded, run animation1 first, then animation2.
      rollAnim.value = withTiming(toValue, config);
      expandAnim.value = withDelay(300, withTiming(toValue, config));
    } else {
      // If it is already expanded, run animation2 first, then animation1.
      expandAnim.value = withTiming(toValue, config);
      rollAnim.value = withDelay(500, withTiming(toValue, config));
    }
  }, [expanded, rollAnim, expandAnim]);

  useEffect(() => {
    return () => {
      // Cancel the animation to prevent it from running after unmount
      cancelAnimation(disabledAnim);
      cancelAnimation(rollAnim);
      cancelAnimation(expandAnim);
    };
  }, []);

  // Constructing animated styles:

  const searchButtonAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rollAnim.value, [0, 1], [0, 360]);

    return {
      right: interpolate(rollAnim.value, [0, 1], [64, 8]),
      backgroundColor: interpolateColor(disabledAnim.value, [0, 1], ['#5A48F5', '#A6ACB1']),
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const addButtonAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rollAnim.value, [0, 1], [0, 180]);
    return {
      right: interpolate(rollAnim.value, [0, 1], [8, -48]),
      backgroundColor: interpolateColor(disabledAnim.value, [0, 1], ['#5A48F5', '#A6ACB1']),
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const bottomBarAnimatedStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(expandAnim.value, [0, 1], [0, 100]);
    return {
      width: interpolate(expandAnim.value, [0, 1], [0, screenWidth - 16]),
      backgroundColor: interpolateColor(disabledAnim.value, [0, 1], ['#5A48F5', '#A6ACB1']),
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
      right: interpolate(
        expandAnim.value,
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
          onChangeText={(text) => setSearchParams(text)}
        />
      </Animated.View>
      {/* Search Button */}
      <AnimatedCircleButton
        disabled={disabled}
        onPress={() => setExpanded(!expanded)}
        buttonStyle={[styles.searchButton, searchButtonAnimatedStyle]}
        iconProps={{
          style: { margin: 'auto' },
          name: 'magnifying-glass-solid',
          width: 20,
          color: Colors.white,
        }}
      />
      {/* Add Food Button */}
      <AnimatedCircleButton
        disabled={disabled}
        onPress={() => navigation.navigate('Create')}
        buttonStyle={[styles.addFoodButton, addButtonAnimatedStyle]}
        iconProps={{
          style: { margin: 'auto' },
          name: 'plus-solid',
          width: 20,
          color: Colors.white,
        }}
      />
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
