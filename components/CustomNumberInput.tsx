import { useMemo } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { StyleProp, TextStyle } from 'react-native';
import { Colors } from 'react-native-ui-lib';

interface CustomNumberInputProps {
  style?: StyleProp<TextStyle>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  maxLength?: number;
  placeholder: string;
}

export default function CustomNumberInput({
  style,
  value,
  setValue,
  maxLength = 7,
  placeholder,
}: CustomNumberInputProps) {
  // Using useMemo to prevent the regex object from being recreated at every render
  const dynamicRegex = useMemo(() => {
    const escapedDot = '\\.';
    return new RegExp(`^(\\d{0,${maxLength - 3}})(${escapedDot}\\d{0,2})?.*$`);
  }, [maxLength]);

  return (
    <TextInput
      textAlign={'center'}
      textAlignVertical={'bottom'}
      style={style}
      keyboardType="number-pad"
      placeholder={placeholder}
      placeholderTextColor={Colors.grey40}
      maxLength={maxLength}
      value={value}
      onChangeText={(text) =>
        setValue(
          text
            .replace(/[^0-9.]/g, '') // Step 1: Remove non-digit and non-dot characters
            .replace(/(\..*?)\./g, '$1') // Step 2: Allow only one dot
            .replace(/^0+(?=\d)/, '') // Step 3: Remove leading zeros before other digits
            .replace(dynamicRegex, '$1$2') // Step 4: Limit to 4 digits before dot and 2 after
        )
      }
    />
  );
}
