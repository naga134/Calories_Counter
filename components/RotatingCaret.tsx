import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import IconSVG from "./icons/IconSVG";
import { Colors } from "react-native-ui-lib";
import { useEffect } from "react";

interface RotatingCaretProps {
  rotated: boolean;
  color: string;
}

const RotatingCaret: React.FC<RotatingCaretProps> = ({ rotated, color }) => {
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
      <IconSVG width={16} name="angle-down-solid" color={color} />
    </Animated.View>
  );
};

export default RotatingCaret;
