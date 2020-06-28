import React, { useCallback, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErros from '../../utils/getValidationErros';
import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logo from '../../assets/logo.png';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccButton,
  CreateAccButtonText
} from './styles';

interface singInPropsForm {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordRef = useRef<TextInput>(null);

  const { singIn, user } = useAuth();

  console.log(user);

  const handleSignIn = useCallback(async (data: singInPropsForm) => {
    formRef.current?.setErrors({});

    try {
      const schema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório').email(),
        password: Yup.string().required('Senha obrigatória')
      });

      await schema.validate(data, { abortEarly: false });

      await singIn({
        email: data.email,
        password: data.password
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const err = getValidationErros(error);
        formRef.current?.setErrors(err);
        Alert.alert('Erro na autenticação', 'Ocorreu um erro no login!');
        return;
      }
    }
  }, []);
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}>
          <Container>
            <Image source={logo} />
            <Title>Faça seu logon</Title>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />

              <Input
                ref={passwordRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Entrar
              </Button>
            </Form>
            <ForgotPassword>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccButton onPress={() => navigation.navigate('SingUp')}>
        <Icon size={20} name="log-in" color="#ff9000" />
        <CreateAccButtonText>Criar uma conta</CreateAccButtonText>
      </CreateAccButton>
    </>
  );
};

export default SignIn;
