import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import IconSVG, { IconSVGProps } from '../../Shared/icons/IconSVG';
import { Colors } from 'react-native-ui-lib';

type AnimatedCircleButtonProps = {
  onPress: () => void;
  buttonStyle?: StyleProp<AnimatedStyle<ViewStyle>>; // Updated type
  iconProps: IconSVGProps;
  disabled?: boolean;
};

export default function AnimatedCircleButton({
  onPress,
  buttonStyle,
  iconProps,
  disabled,
}: AnimatedCircleButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Animated.View style={[buttonStyle, disabled && { backgroundColor: Colors.grey40 }]}>
        <IconSVG {...iconProps} />
      </Animated.View>
    </TouchableOpacity>
  );
}
