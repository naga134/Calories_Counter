// KcalsTransition.tsx
import React, { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text, View } from 'react-native-ui-lib';
import IconSVG from 'components/Shared/icons/IconSVG';
import { useColors } from 'context/ColorContext';

type KcalsTransitionProps = {
  current: number;
  after?: number;
  expanded: boolean;
  expandedHeight: number; // Added prop for expanded height
  onLayout?: (event: LayoutChangeEvent) => void;
};

export default function KcalsTransition({
  current,
  after,
  expanded,
  expandedHeight,
  onLayout,
}: KcalsTransitionProps) {
  const colors = useColors();
  const numbersLength = current.toString().length + (after?.toString().length || 0);
  const textStyle = { fontSize: numbersLength > 12 ? 14 : 16 };

  // Shared value for height
  const height = useSharedValue(80); // Contracted height

  useEffect(() => {
    height.value = withTiming(expanded ? expandedHeight : 80, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  }, [expanded, expandedHeight, height]);

  // Animated style
  const animatedHeight = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      onLayout={onLayout}
      style={[{ backgroundColor: colors.get('kcals'), justifyContent: 'center' }, animatedHeight]}>
      {expanded ? (
        // expanded render
        <View style={styles.expandedFlex}>
          <IconSVG color="white" name="ball-pile-solid" width={20} />
          <Text white style={textStyle}>
            {current}
          </Text>
          <IconSVG color={'white'} name="arrow-right-solid" width={16} />
          <Text white style={textStyle}>
            {after}
          </Text>
        </View>
      ) : (
        // simple render
        <View style={styles.simpleFlex}>
          <IconSVG color="white" name="ball-pile-solid" width={24} />
          <View>
            <Text white style={{ fontSize: 18 }}>
              {after} kcal
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  simpleFlex: {
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  expandedFlex: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
});
