import Animated from "react-native-reanimated";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3";
import { Colors } from "react-native-ui-lib";

export default function PieChart() {
  const radius = 100;

  const arc = d3
    .arc<d3.PieArcDatum<number | { valueOf(): number }>>()
    .innerRadius(radius * 0.67)
    .outerRadius(radius - 1);

  const data = [1, 1, 2];
  const pie = d3.pie();
  const arcs = pie(data);

  console.log(
    arcs.map((d) => ({
      startAngle: d.startAngle,
      endAngle: d.endAngle,
      value: d.value,
    }))
  );

  const arcsArray = arcs.map((data) => {
    const path = arc(data);
    return path !== null ? path : "";
  });

  return (
    <Svg width={100} height={100} viewBox="0 0 200 200">
      <G transform="translate(100,100)">
        <Path d={arcsArray[0]} fill={Colors.green40} />
        <Path d={arcsArray[1]} fill={Colors.red40} />
        <Path d={arcsArray[2]} fill={Colors.blue40} />
      </G>
    </Svg>
  );

  // todo:
  // - receive data from above component.
  // - update whenever new data is input.
  // - animate whenever update.
}
