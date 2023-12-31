import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';

export default function FormClientes({ navigation, route }) {
  const { acaoTipo, cliente: clienteAntigo, onClienteUpdated } = route.params;

  const [formData, setFormData] = useState({
    nome: '',
    nomePet: '',
    cpf: '',
    telefone: '',
    endereco: '',
  });

  // Atualiza o estado inicial do formulário quando a propriedade clienteAntigo for alterada
  useEffect(() => {
    if (clienteAntigo) {
      setFormData({
        nome: clienteAntigo.nome,
        nomePet: clienteAntigo.nomePet,
        cpf: clienteAntigo.cpf,
        telefone: clienteAntigo.telefone,
        endereco: clienteAntigo.endereco || '',
      });
    }
  }, [clienteAntigo]);

  // Esquema de validação para os campos do formulário
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    nomePet: Yup.string().required('Campo obrigatório!'),
    cpf: Yup.string().required('Campo obrigatório!').matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    telefone: Yup.string().required('Campo obrigatório!').matches(/^\(\d{2}\) \d{5}-\d{4,}$/,'Telefone inválido'),

    endereco: Yup.string().required('Campo obrigatório!'),
  });

  const salvar = async (novoCliente) => {
    try {
      // Obtém e parseia os clientes já salvos ou inicializa um array vazio
      let clientesArmazenados = await AsyncStorage.getItem('clientes');
      clientesArmazenados = clientesArmazenados ? JSON.parse(clientesArmazenados) : [];

      // Edita ou adiciona o novo cliente conforme a ação
      if (acaoTipo === 'editar') {
        const indice = clientesArmazenados.findIndex((cliente) => cliente.id === clienteAntigo.id);
        clientesArmazenados[indice] = novoCliente;
      } else {
        novoCliente.id = Date.now();
        clientesArmazenados.push(novoCliente);
      }
      // Salva os clientes de volta no armazenamento local
      await AsyncStorage.setItem('clientes', JSON.stringify(clientesArmazenados));

      // Chama a função de callback se fornecida na rota
      if (onClienteUpdated) {
        await onClienteUpdated();
      }

      navigation.goBack();
    } catch (erro) {
      console.error('Erro ao salvar cliente:', erro);

      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar cliente. Tente novamente.',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.titulo}>
          {acaoTipo === 'editar' ? 'Editar Cliente' : 'Adicionar Cliente'}
        </Text>
        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={(valores) => {
            salvar(valores);
          }}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
            <>
              <View style={styles.containerInput}>
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
                  <Text style={styles.textoErro}>{errors.nome}</Text>
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
                  <Text style={styles.textoErro}>{errors.nomePet}</Text>
                )}

                {/* Utiliza TextInputMask para aplicar a máscara de CPF */}
                <TextInputMask
                  style={styles.input}
                  type={'cpf'}
                  value={values.cpf}
                  onChangeText={handleChange('cpf')}
                  onBlur={handleBlur('cpf')}
                  keyboardType="numeric"
                  customTextInput={TextInput}
                  customTextInputProps={{ mode: 'outlined', label: 'CPF' }}
                  error={touched.cpf && errors.cpf ? true : false}
                />
                {touched.cpf && errors.cpf && (
                  <Text style={styles.textoErro}>{errors.cpf}</Text>
                )}

                {/* Utiliza TextInputMask para aplicar a máscara de telefone */}
                <TextInputMask
                  style={styles.input}
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) ',
                  }}
                  value={values.telefone}
                  onChangeText={(text) => {
                    // Remova todos os caracteres não numéricos
                    const numericValue = text.replace(/\D/g, '');

                    // Valide se há pelo menos 9 dígitos
                    if (numericValue.length >= 9) {
                      handleChange('telefone')(text);
                    }
                  }}
                  onBlur={handleBlur('telefone')}
                  customTextInput={TextInput}
                  customTextInputProps={{ mode: 'outlined', label: 'Telefone' }}
                  keyboardType="numeric"
                  error={touched.telefone && errors.telefone ? true : false}
                />
                {touched.telefone && errors.telefone && (
                  <Text style={styles.textoErro}>{errors.telefone}</Text>
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
                  <Text style={styles.textoErro}>{errors.endereco}</Text>
                )}
              </View>

              {/* Botões de navegação */}
              <View style={styles.containerBotoes}>
                <Button
                  style={[styles.button, { backgroundColor: '#5fa0c8', marginVertical: 30 }]}
                  labelStyle={{ color: '#FFFFFF' }}
                  icon={({ color, size }) => (
                    <MaterialIcons name="arrow-back" color="#FFFFFF" size={size} />
                  )}
                  mode="contained-tonal"
                  onPress={() => navigation.goBack()}
                >
                  Voltar
                </Button>

                <Button
                  style={[styles.button, { backgroundColor: '#008000', marginVertical: 30 }]}
                  icon={({ color, size }) => (
                    <MaterialIcons name="save" color={color} size={size} />
                  )}
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
  titulo: {
    fontWeight: 'bold',
    margin: 10,
  },
  containerInput: {
    width: '80%',
    flex: 1,
  },
  input: {
    marginVertical: 15,
  },
  textoErro: {
    color: 'red',
    textAlign: 'center',
    marginTop: -5,
  },
  containerBotoes: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  botao: {
    width: '50%',
    marginVertical: 10,
  },
});
