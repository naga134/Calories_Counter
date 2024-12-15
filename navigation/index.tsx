import { HeaderBackButton } from '@react-navigation/elements';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Food, Nutritable } from 'database/types';
import React from 'react';
import { View, Text, Button, StyleSheet, Modal as RNModal } from 'react-native';
import Add from 'screens/Add';
import Create from 'screens/Create';
import Edit from 'screens/Edit';

import Home from 'screens/Home';
import FoodsList from 'screens/List';

export type RootStackParamList = {
  Home: undefined;
  List: { title: string }; // List existing foods
  Create: undefined; // Crate new food
  Add: { food: Food }; // Add nutritional table
  Edit: { nutritable: Nutritable; food: Food }; // Edit nutritional table
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="List"
          component={FoodsList}
          options={({ route }) => ({
            title: `Add to ${route.params.title}`, // Set the title dynamically
            animation: 'slide_from_right',
          })}
        />
        <Stack.Screen
          name="Create"
          component={Create}
          options={{
            title: 'Create food',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Add"
          component={Add}
          // TODO: - pass food and existing nutritables as parameters
          // - set title dynamically: "Add nutritional table to [foodname]
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Edit"
          component={Edit}
          // TODO: - pass food and existing nutritables as parameters
          // - set title dynamically: "Edit [foodname]'s nutritional table
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
      {/* Triggered from the navigation */}
    </NavigationContainer>
  );
};
{
  /* <ScreenStackHeaderBackButtonImage */
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // modalContainer: {
  //   width: '100%',
  //   height: 300, // Set the height to take up part of the screen
  //   backgroundColor: 'white',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   padding: 20,
  // },
});

export default RootStack;
