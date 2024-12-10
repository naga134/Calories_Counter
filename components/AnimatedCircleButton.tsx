import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import IconSVG, { IconSVGProps } from './icons/IconSVG';

type AnimatedCircleButtonProps = {
  onPress: () => void;
  buttonStyle?: StyleProp<AnimatedStyle<ViewStyle>>; // Updated type
  iconProps: IconSVGProps;
};

export default function AnimatedCircleButton({
  onPress,
  buttonStyle,
  iconProps,
}: AnimatedCircleButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={buttonStyle}>
        <IconSVG {...iconProps} />
      </Animated.View>
    </TouchableOpacity>
  );
}
