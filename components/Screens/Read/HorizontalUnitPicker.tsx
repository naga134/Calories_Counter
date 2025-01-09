import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
} from 'react-native';
import { Colors } from 'react-native-ui-lib';

type Unit = {
  id: number;
  symbol: string;
};

interface HorizontalUnitsPickerProps {
  // Logic
  data: Unit[];
  selectedIndex: {
    value: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
  onChangeUnit: (unit: Unit) => void;
  // Render
  wheelWidth: number; // The visible width of this picker
  wheelHeight?: number; // Let the parent specify a fixed height for the picker
}

export default function HorizontalUnitsPicker({
  data,
  wheelWidth,
  wheelHeight = 80, // fallback to 80 if none given
  selectedIndex,
  onChangeUnit,
}: HorizontalUnitsPickerProps) {
  const flatListRef = useRef<FlatList<Unit>>(null);

  // Each item takes up 1/3 of the available picker width
  const ITEM_WIDTH = wheelWidth / 3;

  // Informs whether there is an ongoing scrolling action.
  const [scrolling, setScrolling] = useState(false);

  // Called when scrolling stops. Figure out which item is centered, set it as selected.
  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    selectedIndex.set(index);
    setScrolling(false);
  };

  // Handles scroll on user press
  const handlePress = (index: number) => {
    setScrolling(true);
    selectedIndex.set(index);
    flatListRef.current?.scrollToOffset({
      offset: index * ITEM_WIDTH,
      animated: true,
    });
  };

  // Handles scroll on data change
  useEffect(() => {
    // workaround: this prevented handlePress' animation from occuring
    if (scrolling === false) {
      if (selectedIndex.value >= 0 && selectedIndex.value < data.length) {
        flatListRef.current?.scrollToOffset({
          offset: selectedIndex.value * ITEM_WIDTH,
          animated: true,
        });
      }
    }
  }, [selectedIndex, data]);

  useEffect(() => {
    onChangeUnit(data[selectedIndex.value]);
  }, [selectedIndex]);

  return (
    <View
      style={{
        width: wheelWidth,
        height: wheelHeight,
        borderRadius: 20,
        overflow: 'hidden', // ensures children respect parent’s border radius
        backgroundColor: 'white',
      }}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        keyExtractor={(item) => String(item.id)}
        // Makes the FlatList fill the parent container's height
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        // Adds symmetrical horizontal padding so items can center
        contentContainerStyle={{
          paddingHorizontal: (wheelWidth - ITEM_WIDTH) / 2,
        }}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex.value;
          return (
            <Pressable
              style={[styles.itemContainer, { width: ITEM_WIDTH }]}
              onPress={() => handlePress(index)}>
              <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                {item.symbol}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: Colors.grey40,
    fontSize: 18,
  },
  itemTextSelected: {
    fontSize: 18,
    color: Colors.violet30,
  },
});
