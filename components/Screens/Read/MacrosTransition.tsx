import IconSVG from 'components/Shared/icons/IconSVG';
import { useColors } from 'context/ColorContext';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';

type MacrosTransitionProps = {
  current: number;
  after?: number;
  macro: 'carbs' | 'protein' | 'fat';
};

export default function MacrosTransition({ current, after, macro }: MacrosTransitionProps) {
  const colors = useColors();

  const numbersLength = current.toString().length + (after?.toString().length || 0);
  const textStyle = { fontSize: numbersLength > 12 ? 14 : 16 };

  return (
    <View style={[styles.flex, { backgroundColor: colors.get(macro) }]}>
      <IconSVG color="white" name={determineIcon(macro)} width={20} />
      <Text white style={textStyle}>
        {current}
      </Text>
      <IconSVG color={'white'} name="arrow-right-solid" width={16} />
      <Text white style={textStyle}>
        {after}
      </Text>
    </View>
  );
}

function determineIcon(macro: 'carbs' | 'protein' | 'fat') {
  switch (macro) {
    case 'fat':
      return 'bacon-solid';
    case 'carbs':
      return 'wheat-solid';
    case 'protein':
      return 'meat-solid';
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
});
