import React, { PropsWithChildren, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface MacrosAccordionProps extends PropsWithChildren {
  expanded: boolean;
  leftoverSpace: number; // height the Accordion should animate to
}

/**
 * This animated container starts at height=0 (collapsed)
 * and expands to leftoverSpace when 'expanded' is true.
 */
export default function MacrosAccordion({
  expanded,
  leftoverSpace,
  children,
}: MacrosAccordionProps) {
  const heightValue = useSharedValue(0);

  // Animate from 0 → leftoverSpace or leftoverSpace → 0
  useEffect(() => {
    heightValue.value = withTiming(expanded ? leftoverSpace : 0, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  }, [expanded, leftoverSpace]);

  // Animated style: we update 'height' and optionally 'opacity'
  const containerStyle = useAnimatedStyle<ViewStyle>(() => ({
    height: heightValue.value,
    overflow: 'hidden',
  }));

  return <Animated.View style={containerStyle}>{children}</Animated.View>;
}
