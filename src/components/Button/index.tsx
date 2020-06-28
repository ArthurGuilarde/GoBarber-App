import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

interface ButtonPorps extends RectButtonProperties {
  children: string;
}

import { Container, ButtonText } from './styles';
const Button: React.FC<ButtonPorps> = ({ children, ...props }) => (
  <Container {...props}>
    <ButtonText>{children}</ButtonText>
  </Container>
);
export default Button;
