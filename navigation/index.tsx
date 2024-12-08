import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, StyleSheet, Modal as RNModal } from 'react-native';
import CreateFood from 'screens/CreateFood';

import Home from 'screens/Home';
import FoodsList from 'screens/List';

export type RootStackParamList = {
  Home: undefined;
  List: { title: string };
  Create: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Create"
          component={CreateFood}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="List"
          component={FoodsList}
          options={({ route }) => ({
            title: `Add to ${route.params.title}`, // Set the title dynamically
            animation: 'slide_from_right',
          })}
        />
      </Stack.Navigator>
      {/* Triggered from the navigation */}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    height: 300, // Set the height to take up part of the screen
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});

export default RootStack;
