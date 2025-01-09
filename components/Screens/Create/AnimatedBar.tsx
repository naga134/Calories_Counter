import { useEffect } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

type AnimatedBarProps = {
  width: number;
  color: string;
  style?: StyleProp<ViewStyle>;
};

export default function AnimatedBar({ width, color, style }: AnimatedBarProps) {
  const animatedWidth = useSharedValue<number>(width);

  const animationOptions: WithTimingConfig = {
    duration: 1000,
    easing: Easing.inOut(Easing.cubic),
  };

  useEffect(() => {
    animatedWidth.value = withTiming(width, animationOptions);
  }, [width]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: animatedWidth.value,
      height: 30,
      backgroundColor: color,
    };
  });

  return <Animated.View style={[style, animatedStyle]} />;
}
