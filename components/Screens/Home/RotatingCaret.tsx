import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from 'react-native-ui-lib';
import IconSVG from 'components/Shared/icons/IconSVG';
import { useEffect } from 'react';

interface RotatingCaretProps {
  rotated: boolean;
  color: string;
  size: number;
}

const RotatingCaret: React.FC<RotatingCaretProps> = ({ rotated, color, size }) => {
  const rotation = useSharedValue<number>(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    rotation.value = rotated
      ? withTiming(180, { duration: 350 })
      : withTiming(0, { duration: 350 });
  }, [rotated]);

  return (
    <Animated.View style={animatedStyles}>
      <IconSVG width={size} name="angle-down-solid" color={color} />
    </Animated.View>
  );
};

export default RotatingCaret;
