import React, { useEffect, useState } from 'react';
import { Button, Colors, Dialog, Text, View } from 'react-native-ui-lib';
import { ErrorType, ValidationError } from 'utils/validation/types';
import IconSVG from './icons/IconSVG';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

type DialogsPropsType = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  errors: ValidationError[];
};

export default function Dialogs({ show, setShow, errors }: DialogsPropsType) {
  const screenHeight = Dimensions.get('window').height;
  const [showErrors, setShowErrors] = useState<boolean[]>([]);

  useEffect(() => {
    setShowErrors(Array(errors.length).fill(true));
  }, [errors]);

  useEffect(() => {
    setShow(showErrors.includes(true));
  }, [showErrors]);

  return (
    <Dialog
      visible={show}
      onDismiss={() => setShow(false)}
      containerStyle={{
        overflow: 'visible',
        gap: 20,
      }}
      panDirection="down">
      {errors.map((error, errorIndex) => {
        const backgroundColor = error.type === ErrorType.Error ? Colors.red80 : Colors.yellow80;
        const borderColor = error.type === ErrorType.Error ? Colors.red60 : Colors.yellow60;
        const iconColor = error.type === ErrorType.Error ? Colors.red30 : Colors.yellow20;
        const iconName =
          error.type === ErrorType.Error
            ? 'hexagon-exclamation-solid'
            : 'triangle-exclamation-solid';

        const buttonColor = error.type === ErrorType.Error ? Colors.red50 : Colors.yellow50;

        return (
          showErrors[errorIndex] && (
            <View key={errorIndex} style={[styles.dialog, { borderColor, backgroundColor }]}>
              <TouchableOpacity
                onPress={() => {
                  setShowErrors(
                    showErrors.map((show, showIndex) => (errorIndex === showIndex ? false : show))
                  );

                  // setShowErrors()
                  //   const visibilityArray = [...errorsVisibility];
                  //   visibilityArray[index] = false;
                  //   setErrorsVisibility(visibilityArray);
                }}
                style={[styles.dismissButton, { backgroundColor: buttonColor }]}>
                <IconSVG
                  name="xmark-large-solid"
                  style={{ margin: 'auto' }}
                  width={16}
                  color={'white'}
                />
              </TouchableOpacity>
              <IconSVG name={iconName} color={iconColor} width={40} />
              <Text style={{ textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
                {error.message}
              </Text>
            </View>
          )
        );
      })}
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    width: '100%',
    borderWidth: 2,
    padding: 20,
    gap: 8,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButton: {
    width: 28,
    height: 28,
    borderRadius: '100%',
    position: 'absolute',
    right: -16,
  },
});
