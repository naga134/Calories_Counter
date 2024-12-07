import RotatingCaret from 'components/RotatingCaret';
import { Food } from 'database/types';
import { useState } from 'react';
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';

export default function FoodListItem({ food }: { food: Food }) {
  const [rotated, setRotated] = useState(false);

  return (
    <TouchableOpacity useNative onPress={() => setRotated(!rotated)}>
      <View
        key={food.id}
        style={{
          height: 'auto',
          backgroundColor: Colors.white,
          padding: 15,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ fontSize: 18 }}>{food.name}</Text>
        <RotatingCaret rotated={rotated} color={Colors.grey20} />
      </View>
    </TouchableOpacity>
  );
}
