import IconSVG from 'components/Shared/icons/IconSVG';
import { useColors } from 'context/ColorContext';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';

export default function SegmentedMacrosBarChart() {
  const colors = useColors();

  return (
    <View>
      <MacroMathView icon={'bacon-solid'} color={colors.get('fat')} />
      <MacroMathView icon={'wheat-solid'} color={colors.get('carbs')} />
      <MacroMathView icon={'meat-solid'} color={colors.get('protein')} />
      <MacroMathView icon={'ball-pile-solid'} color={colors.get('kcals')} />
    </View>
  );
}

function MacroMathView({ color, icon }) {
  return (
    <View style={[styles.flex, { backgroundColor: color }]}>
      {/* macro icon */}
      <IconSVG name={icon} width={28} color={'white'} style={{ marginRight: 8 }} />
      {/* current amount */}
      <Text style={styles.text}>0g</Text>
      {/* plus sign */}
      <IconSVG name="plus-solid" width={20} color={'white'} style={{ marginHorizontal: 8 }} />
      {/* amount to be added */}
      <Text style={styles.text}>0g</Text>
      {/* equals sign */}
      <IconSVG name="equals-solid" width={20} color={'white'} style={{ marginHorizontal: 8 }} />
      {/* resulting amount */}
      <Text style={styles.text}>0g</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
  },
  flex: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    backgroundColor: Colors.violet30,
    alignItems: 'center',
    paddingHorizontal: 12,

    // borderRadius: 8,
  },
});
