import { useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  ReduceMotion,
  WithTimingConfig,
} from "react-native-reanimated";

import { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path); // (1)

type AnimatedArcProps = {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  fill: string;
};

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number, // (we will use this function twice: once for the inner, once for the outer radius)
  angleInRadians: number
) {
  "worklet";
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createArcPath(
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  "worklet";
  const outerRadiusStartAngle = polarToCartesian(
    centerX,
    centerY,
    outerRadius,
    startAngle
  );
  const outerRadiusEndAngle = polarToCartesian(
    centerX,
    centerY,
    outerRadius,
    endAngle
  );
  const innerRadiusStartAngle = polarToCartesian(
    centerX,
    centerY,
    innerRadius,
    startAngle
  );
  const innerRadiusEndAngle = polarToCartesian(
    centerX,
    centerY,
    innerRadius,
    endAngle
  );

  const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

  return [
    // Moves to the starting point of the outer angle
    "M",
    outerRadiusStartAngle.x, // starting point coordinate X
    outerRadiusStartAngle.y, // starting point coordinate Y

    // Draws the outer arch:
    "A",
    outerRadius, // rx - The ellipsoidal radius x of the arch (**)
    outerRadius, // ry - The ellipsoidal radius y of the arch (**)
    0, // x-axis-rotation - Specifies how much (deg) the ellipse is rotated relative to the x-axis.
    largeArcFlag, // Do we take the long or the short path?
    1, // sweep-flag (0 or 1) - Indicates the direction in which the arc is drawn.
    outerRadiusEndAngle.x, // endpoint coordinate X
    outerRadiusEndAngle.y, // endpoint coordinate Y

    // Draws a line from the end of the outer arch to the beginning of the starting arch.
    "L",
    innerRadiusEndAngle.x, // starting point coordinate X
    innerRadiusEndAngle.y, // starting point coordinate Y

    // Draws the inner arch:
    "A",
    innerRadius, // rx
    innerRadius, // ry
    0, // x-axis-rotation
    largeArcFlag,
    0, // sweep-flag (0 or 1)
    innerRadiusStartAngle.x,
    innerRadiusStartAngle.y,

    // Close path:
    "Z",
  ].join(" ");
}

function AnimatedArc({
  startAngle,
  endAngle,
  innerRadius,
  outerRadius,
  fill,
}: AnimatedArcProps) {
  // Setting up animated values
  const animatedStartAngle = useSharedValue<number>(startAngle);
  const animatedEndAngle = useSharedValue<number>(endAngle);

  const animationOptions: WithTimingConfig = {
    duration: 1000,
    easing: Easing.inOut(Easing.cubic),
    reduceMotion: ReduceMotion.System,
  };

  useEffect(() => {
    animatedStartAngle.set(withTiming(startAngle, animationOptions));
    animatedEndAngle.set(withTiming(endAngle, animationOptions));
  }, [startAngle, endAngle]); // every time these change, we reanimate with timing

  const animatedProps = useAnimatedProps(() => {
    return {
      d:
        createArcPath(
          0,
          0,
          innerRadius,
          outerRadius,
          animatedStartAngle.get(),
          animatedEndAngle.get()
        ) ?? "",
    };
  });

  return <AnimatedPath animatedProps={animatedProps} fill={fill} />;
}

export default AnimatedArc;

// (1) https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent/

// (**) Think of ellipses (ovals): their arches are deformed, and not perfectly circular.
// This is because their radius along the X and Y axes are not the same. In our case, we
// want them to be the same (we want a perfect circle), and so we give rx and ry the same value.
