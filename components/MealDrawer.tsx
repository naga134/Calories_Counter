import { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { ExpandableSection, Text, View, Colors, Button } from 'react-native-ui-lib';

import IconSVG from './icons/IconSVG';
import RotatingCaret from './RotatingCaret';
// import { Link, useNavigation } from "expo-router";
import { Pressable } from 'react-native-gesture-handler';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';

type MealDrawerProps = {
  mealName: string;
};

type DrawerHeaderProps = {
  mealName: string;
  expanded: boolean;
};

type DrawerBodyProps = {
  mealName: string;
};

export default function MealDrawer({ mealName }: MealDrawerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExpandableSection
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      sectionHeader={<DrawerHeader mealName={mealName} expanded={expanded} />}>
      <DrawerBody mealName={mealName} />
    </ExpandableSection>
  );
}

// This is the header for each meal's drawer.
// It should contain: kcals overview, meal name, caret.
function DrawerHeader({ expanded, mealName }: DrawerHeaderProps) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View
      style={[
        styles.sectionHeader,
        {
          width: screenWidth * 0.8,
          borderBottomLeftRadius: expanded ? 0 : 10,
          borderBottomRightRadius: expanded ? 0 : 10,
        },
      ]}>
      <View>{/* kcals overview comes here */}</View>
      <Text grey10 text70>
        {mealName}
      </Text>
      <RotatingCaret
        size={16}
        rotated={expanded}
        color={expanded ? Colors.grey50 : Colors.grey20}
      />
    </View>
  );
}

// This is the body for each meal's drawer.
// It should contain: each food, its amount, its caloric total; "add food" button.
function DrawerBody({ mealName }: DrawerBodyProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.sectionBody}>
      {/* Each entry COMES HERE*/}

      {/* Wrap link inside a touchable opacity for visual feedback */}
      {/* Add styling to the link so it looks like a button */}
      <TouchableOpacity
        // href="/FoodsList"
        // asChild
        onPress={() => navigation.navigate('List', { title: mealName })}
        style={{
          flex: 1,
          width: 40,
          height: 40,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.violet70,
        }}>
        <IconSVG name={'plus-solid'} width={16} color={Colors.violet40} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    height: 'auto',
    backgroundColor: Colors.white,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionBody: {
    gap: 8,
    backgroundColor: Colors.grey80,
    minHeight: 60,
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
