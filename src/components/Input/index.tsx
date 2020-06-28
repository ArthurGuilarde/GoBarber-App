import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

import { Container, TextInput, Icon } from './styles';
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...props },
  ref
) => {
  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputRef = useRef<InputValueReference>({ value: defaultValue });
  const elementRef = useRef<any>(null);

  const [isFocus, setFocus] = useState(false);
  const [isField, setField] = useState(false);

  const handleFocus = useCallback(() => {
    setFocus(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocus(false);
    setField(!!inputRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      elementRef.current.focus();
    }
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputRef.current.value = value;
        elementRef.current.setNativeProps({ text: value });
      }
    });
  }, [registerField, fieldName]);

  return (
    <Container isFocus={isFocus} isField={isField} isErrored={!!error}>
      <Icon
        isFocus={isFocus}
        isField={isField}
        name={icon}
        size={20}
        color="#666360"
      />
      <TextInput
        ref={elementRef}
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onChangeText={(value) => (inputRef.current.value = value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        {...props}
      />
    </Container>
  );
};
export default forwardRef(Input);
