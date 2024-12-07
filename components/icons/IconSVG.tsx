import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

import icons from "./SVGs.json";

type IconName =
  | "calendar-1"
  | "calendar-2"
  | "calendar-3"
  | "plus-solid"
  | "meat-solid"
  | "wheat-solid"
  | "bacon-solid"
  | "ball-pile-solid"
  | "angle-down-solid"
  | "square-solid"
  | "fork-knife-solid";

const IconSVG = (props: SvgProps & { name: IconName }) => {
  return (
    <Svg
      viewBox={icons[props.name].viewBox}
      width={props.width || 24}
      height={props.height || props.width || 24}
      {...props}
    >
      <Path fill={props.color || "#000000"} d={icons[props.name].path} />
    </Svg>
  );
};

export default IconSVG;
