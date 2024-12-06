import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import IconSVG from "./icons/IconSVG";
import { Colors } from "react-native-ui-lib";

interface RotatingCaretProps {
  rotated: boolean;
}

const RotatingCaret: React.FC<RotatingCaretProps> = ({ rotated }) => {
  const rotation = useSharedValue<number>(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  rotation.value = rotated
    ? withTiming(180, { duration: 350 })
    : withTiming(0, { duration: 350 });

  return (
    <Animated.View style={animatedStyles}>
      <IconSVG
        width={16}
        name="angle-down-solid"
        color={rotated ? Colors.grey50 : Colors.grey20}
      />
    </Animated.View>
  );
};

export default RotatingCaret;
