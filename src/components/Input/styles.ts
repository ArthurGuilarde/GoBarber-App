import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface Props {
  isFocus: boolean;
  isField: boolean;
  isErrored?: boolean;
}

export const Container = styled.View<Props>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  margin-bottom: 8px;

  border: 2px solid #232129;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocus &&
    css`
      border-color: #ff9000;
    `}


  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)<Props>`
  margin-right: 16px;

  ${(props) =>
    props.isFocus || props.isField
      ? css`
          color: #ff9000;
        `
      : css`
          color: #666360;
        `}
`;
