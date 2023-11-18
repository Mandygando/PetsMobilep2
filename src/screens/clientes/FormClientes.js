import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormClientes({ navigation, route }) {
  const { acaoTipo, cliente: clienteAntigo, onClienteUpdated } = route.params;

  const [formData, setFormData] = useState({
    nome: '',
    nomePet: '',
    cpf: '',
    endereco: '',
  });

  useEffect(() => {
    if (clienteAntigo) {
      setFormData({
        nome: clienteAntigo.nome,
        nomePet: clienteAntigo.nomePet,
        cpf: clienteAntigo.cpf,
        endereco: clienteAntigo.endereco || '',
      });
    }
  }, [clienteAntigo]);

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    nomePet: Yup.string().required('Campo obrigatório!'),
    cpf: Yup.string().required('Campo obrigatório!').matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    endereco: Yup.string().required('Campo obrigatório!'),
  });

  const formatCPF = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    const formattedText = cleanedText.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formattedText;
  };

  const salvar = async (novoCliente) => {
    try {
      let clientesStorage = await AsyncStorage.getItem('clientes');
      clientesStorage = clientesStorage ? JSON.parse(clientesStorage) : [];

      if (acaoTipo === 'editar') {
        const index = clientesStorage.findIndex((cliente) => cliente.id === clienteAntigo.id);
        clientesStorage[index] = novoCliente;
      } else {
        novoCliente.id = Date.now();
        clientesStorage.push(novoCliente);
      }

      await AsyncStorage.setItem('clientes', JSON.stringify(clientesStorage));

      Toast.show({
        type: 'success',
        text1: 'Cliente salvo com sucesso!',
      });

      if (onClienteUpdated) {
        await onClienteUpdated();
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);

      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar cliente. Tente novamente.',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          {acaoTipo === 'editar' ? 'Editar Cliente' : 'Adicionar Cliente'}
        </Text>

        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            salvar(values);
          }}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Nome"
                  value={values.nome}
                  onChangeText={handleChange('nome')}
                  onBlur={handleBlur('nome')}
                  error={touched.nome && errors.nome ? true : false}
                />
                {touched.nome && errors.nome && (
                  <Text style={styles.errorText}>{errors.nome}</Text>
                )}

                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Nome do Pet"
                  value={values.nomePet}
                  onChangeText={handleChange('nomePet')}
                  onBlur={handleBlur('nomePet')}
                  error={touched.nomePet && errors.nomePet ? true : false}
                />
                {touched.nomePet && errors.nomePet && (
                  <Text style={styles.errorText}>{errors.nomePet}</Text>
                )}

                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="CPF"
                  value={formatCPF(values.cpf)}
                  onChangeText={(text) => handleChange('cpf')(formatCPF(text))}
                  onBlur={handleBlur('cpf')}
                  keyboardType="numeric"
                  error={touched.cpf && errors.cpf ? true : false}
                />

                {touched.cpf && errors.cpf && (
                  <Text style={styles.errorText}>{errors.cpf}</Text>
                )}

                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Endereço"
                  value={values.endereco}
                  onChangeText={handleChange('endereco')}
                  onBlur={handleBlur('endereco')}
                  error={touched.endereco && errors.endereco ? true : false}
                />
                {touched.endereco && errors.endereco && (
                  <Text style={styles.errorText}>{errors.endereco}</Text>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  style={[styles.button, { backgroundColor: '#5fa0c8' }]}
                  onPress={() => navigation.goBack()}
                >
                  Voltar
                </Button>

                <Button
                  style={[styles.button, { backgroundColor: '#008000' }]}
                  mode="contained"
                  onPress={handleSubmit}
                >
                  Salvar
                </Button>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    margin: 10,
  },
  inputContainer: {
    width: '80%',
    flex: 1,
  },
  input: {
    margin: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: -5,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '40%',
    marginVertical: 10,
  },
});
