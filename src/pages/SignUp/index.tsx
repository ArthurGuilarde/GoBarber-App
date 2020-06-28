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
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logo from '../../assets/logo.png';
import { Container, Title, BackToSingIn, BackToSingInText } from './styles';

interface singInPropsForm {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: singInPropsForm) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().required('Email obrigatório').email(),
          password: Yup.string().min(6, 'Mínimo 6 digitos')
        });

        await schema.validate(data, { abortEarly: false });
        formRef.current?.reset();

        await api.post('/users', data);

        navigation.goBack();

        Alert.alert('Cadastrado', 'Você já pode fazer o login!');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const err = getValidationErros(error);
          formRef.current?.setErrors(err);
          Alert.alert('Erro no cadastro', 'Ocorreu um erro no Cadastro!');
          return;
        }
      }
    },
    [navigation]
  );

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
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Image source={logo} />
              <Title>Crie sua conta</Title>
              <Input
                autoCapitalize="words"
                autoCorrect={false}
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />
              <Input
                ref={emailRef}
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
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSingIn onPress={() => navigation.goBack()}>
        <Icon size={20} name="arrow-left" color="#fff" />
        <BackToSingInText>Voltar para login</BackToSingInText>
      </BackToSingIn>
    </>
  );
};

export default SignUp;
