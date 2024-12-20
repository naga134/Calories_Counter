import { useMemo } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { StyleProp, TextStyle } from 'react-native';
import { Colors } from 'react-native-ui-lib';

interface CustomNumberInputProps {
  style?: StyleProp<TextStyle>;
  value: string;
  onChange?: (text: string) => void;
  maxLength: number;
  placeholder?: string;
}

//
export default function CustomNumberInput({
  value,
  onChange,
  maxLength,
  placeholder = '0.00',
}: CustomNumberInputProps) {
  // Using useMemo to prevent the regex object from being recreated at every render
  const dynamicRegex = useMemo(() => {
    const escapedDot = '\\.';
    return new RegExp(`^(\\d{0,${maxLength - 3}})(${escapedDot}\\d{0,2})?.*$`);
  }, [maxLength]);

  return (
    <TextInput
      // Functionality
      maxLength={maxLength}
      keyboardType="number-pad"
      // Style
      textAlign={'center'}
      textAlignVertical={'bottom'}
      style={{
        // positioning
        flex: 1,
        padding: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
        // styling
        fontSize: 18,
        color: Colors.grey30,
      }}
      // Placeholder
      placeholder={placeholder}
      placeholderTextColor={Colors.grey40}
      // I/O
      value={value}
      onChangeText={(text) => {
        const treatedText = text
          // 1: Allow only digits and dots
          .replace(/[^0-9.]/g, '')
          // 2: Allow only one dot
          .replace(/(\..*?)\./g, '$1')
          // 3: Remove redundant leading zeros
          .replace(/^0+(?=\d)/, '')
          // 4: Limit to 4 digits before dot and 2 after
          .replace(dynamicRegex, '$1$2');

        if (onChange) {
          return onChange(treatedText);
        }
      }}
    />
  );
}
