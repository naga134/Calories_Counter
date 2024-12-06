import { pie } from "d3";
import Svg, { G } from "react-native-svg";

import AnimatedArc from "./AnimatedArc";

interface Props {
  data: number[];
  colors: string[];
  innerRadius: number;
  outerRadius: number;
}

export default function PieChart({
  data,
  colors,
  innerRadius,
  outerRadius,
}: Props) {
  // The size of the canvas is the outer diameter of the donut chart.
  const size = outerRadius * 2;
  // Generates the start and end angles for each arch.
  const arcs = pie().sort(null)(data);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform="translate(100,100)">
        {arcs.map((arc, index) => (
          <AnimatedArc
            key={index}
            startAngle={arc.startAngle}
            endAngle={arc.endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill={colors[index]}
          />
        ))}
      </G>
    </Svg>
  );
}
