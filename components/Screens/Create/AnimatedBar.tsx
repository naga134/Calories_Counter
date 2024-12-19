import { useEffect } from 'react';
import { Dimensions } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

type AnimatedBarProps = {
  amount: number;
  maxAmount: number;
  color: string;
};

export default function AnimatedBar({ amount, maxAmount, color }: AnimatedBarProps) {
  const screenWidth = Dimensions.get('window').width;

  const animatedWidth = useSharedValue<number>(amount);
  const animatedMax = useSharedValue(maxAmount);

  const animationOptions: WithTimingConfig = {
    duration: 1000,
    easing: Easing.inOut(Easing.cubic),
  };

  useEffect(() => {
    animatedWidth.value = withTiming(amount, animationOptions);
  }, [amount]);

  useEffect(() => {
    animatedMax.value = withTiming(maxAmount, animationOptions);
  }, [maxAmount]);

  const animatedStyle = useAnimatedStyle(() => {
    const availableWidth = screenWidth - 40 - 60;

    return {
      height: 30,
      width: (availableWidth * animatedWidth.value) / animatedMax.value + 8,
      backgroundColor: color,
      borderBottomEndRadius: 5,
      borderTopEndRadius: 5,
    };
  });

  return <Animated.View style={animatedStyle} />;
}
