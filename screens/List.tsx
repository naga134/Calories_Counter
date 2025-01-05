import { getAllFoods } from 'database/queries/foodsQueries';
import { addDatabaseChangeListener, SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from '@tanstack/react-query';
import FoodListItem from 'components/FoodsListItem';
import { Colors, Text, TextField, View } from 'react-native-ui-lib';
import { RootStackParamList } from 'navigation/index';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Easing,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated';

import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AnimatedCircleButton from 'components/Screens/List/AnimatedCircleButton';
import { Meal } from 'database/types';
import IconSVG from 'components/Shared/icons/IconSVG';

type Props = StaticScreenProps<{
  meal: Meal;
}>;

export default function List({ route }: Props) {
  const database: SQLiteDatabase = useSQLiteContext();

  const meal = route.params.meal;

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
      {foods.length === 0 ? (
        <View center flex marginB-40>
          <IconSVG name="face-sad-solid" color={Colors.grey50} width={56} />
          <IconSVG
            name="bowl-chopsticks-question-solid"
            color={Colors.grey50}
            width={68}
            style={{ marginLeft: 12 }}
          />
          <Text style={{ fontSize: 20, color: Colors.grey50, fontWeight: 600, marginLeft: 12 }}>
            Nothing to eat here...
          </Text>
        </View>
      ) : (
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
              <FoodListItem food={food} meal={meal} />
              // )
            );
          }}
        />
      )}
      <BottomBar
        hideSearch={foods.length === 0}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        disabled={!scrollEnabled}
      />
    </>
  );
}

interface BottomBarProps {
  hideSearch?: boolean;
  disabled?: boolean; // Optional boolean indicating if the bottom bar is disabled
  searchParams: string; // The current search string
  setSearchParams: React.Dispatch<React.SetStateAction<string>>; // State updater function for searchParams
}

function BottomBar({ hideSearch, disabled, searchParams, setSearchParams }: BottomBarProps) {
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
      cancelAnimation(rollAnim);
      cancelAnimation(expandAnim);
    };
  }, []);

  // Constructing animated styles:

  const searchButtonAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rollAnim.value, [0, 1], [0, 360]);

    return {
      right: interpolate(rollAnim.value, [0, 1], [64, 8]),
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const addButtonAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rollAnim.value, [0, 1], [0, 180]);
    return {
      right: interpolate(rollAnim.value, [0, 1], [8, -48]),
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const bottomBarAnimatedStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(expandAnim.value, [0, 1], [0, 100]);
    return {
      width: interpolate(expandAnim.value, [0, 1], [0, screenWidth - 16]),
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
      {hideSearch ? (
        <View style={styles.yetFlex}>
          <Text style={styles.yetText}>...Yet!</Text>
          <IconSVG name="face-wink-solid" color={Colors.grey50} width={40} />
        </View>
      ) : (
        <>
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
        </>
      )}
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
  yetFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 12,
    gap: 8,
    right: 64,
  },
  yetText: {
    fontSize: 20,
    color: Colors.grey50,
    fontWeight: 600,
    marginLeft: 12,
    textAlignVertical: 'center',
  },
});
