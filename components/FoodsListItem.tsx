import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Food, Meal } from 'database/types';
import { Colors, Text, TouchableOpacity } from 'react-native-ui-lib';

// import WheelPicker from '@quidone/react-native-wheel-picker';
import { StyleSheet } from 'react-native';
import IconSVG from './Shared/icons/IconSVG';
import { RootStackParamList } from 'navigation';

type FoodListItemProps = {
  food: Food;
  meal: Meal;
};

export default function FoodListItem({ food, meal }: FoodListItemProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      style={[styles.listItem]}
      onPress={() => {
        navigation.navigate('Read', { foodId: food.id, meal });
      }}>
      <Text style={{ fontSize: 18 }}>{food.name}</Text>
      <IconSVG name="arrow-right-solid" width={16} color={Colors.violet50} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    height: 56,
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
