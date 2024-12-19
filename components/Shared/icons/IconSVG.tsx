import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

import icons from './SVGs';

type IconName = keyof typeof icons;

export type IconSVGProps = SvgProps & { name: IconName };

const IconSVG = (props: IconSVGProps) => {
  return (
    <Svg
      viewBox={icons[props.name].viewBox}
      width={props.width || 24}
      height={props.height || props.width || 24}
      {...props}>
      <Path fill={props.color || '#000000'} d={icons[props.name].path} />
    </Svg>
  );
};

export default IconSVG;
