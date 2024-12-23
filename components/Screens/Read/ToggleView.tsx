import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Colors, Text, View } from 'react-native-ui-lib';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import IconSVG from 'components/Shared/icons/IconSVG';
import { ViewMode } from 'screens/Read';

// Define the structure for each mode
const MODES: { mode: ViewMode; label: string }[] = [
  { mode: ViewMode.Simple, label: 'Simple' },
  { mode: ViewMode.Meal, label: 'Meal' },
  { mode: ViewMode.Day, label: 'Day' },
];

// Define the Props Interface
interface ToggleViewProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

// ToggleButton Component
interface ToggleButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, isSelected, onPress }) => {
  // Shared values for animation
  const scale = useSharedValue(1);
  const color = useSharedValue(Colors.grey40);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    color: color.value,
  }));

  // Effect to handle animations based on selection
  useEffect(() => {
    if (isSelected) {
      scale.value = withTiming(1.1, { duration: 200 });
      color.value = Colors.violet30;
    } else {
      scale.value = withTiming(1, { duration: 200 });
      color.value = Colors.grey40;
    }
  }, [isSelected, scale, color]);

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Animated.Text style={[styles.text, animatedStyle]}>{label}</Animated.Text>
    </Pressable>
  );
};

// Main ToggleView Component
const ToggleView: React.FC<ToggleViewProps> = ({ viewMode, setViewMode }) => {
  return (
    <View style={styles.container}>
      {/* Animated Background Circle */}
      <View style={styles.circle}>
        <IconSVG
          name="table-layout-regular"
          color={'white'}
          width={20}
          style={{ margin: 'auto' }}
        />
      </View>

      {/* Toggle Buttons */}
      <View style={styles.buttonsContainer}>
        {MODES.map(({ mode, label }) => (
          <ToggleButton
            key={mode}
            label={label}
            isSelected={viewMode === mode}
            onPress={() => setViewMode(mode)}
          />
        ))}
      </View>
    </View>
  );
};

export default ToggleView;

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Needed for the animated background
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.violet30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
