import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Define o componente principal
export default function FormAdocao({ navigation, route }) {
  // Extrai dados da rota
  const { acaoTipo, pet: petAntigo } = route.params;

  // Estados iniciais
  const [imagem, setImagem] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    raca: '',
    idade: '',
  });
  const [formReady, setFormReady] = useState(false);

  // Efeito para preencher o formulário com dados do pet antigo, se existirem
  useEffect(() => {
    if (petAntigo) {
      setFormData((prevData) => ({
        ...prevData,
        nome: petAntigo.nome || '',
        raca: petAntigo.raca || '',
        idade: petAntigo.idade ? petAntigo.idade.toString() : '',
      }));
      setImagem(petAntigo.imagem);
      setFormReady(true);
    }
  }, [petAntigo]);

  // Efeito para logar os dados do formulário quando ele estiver pronto
  useEffect(() => {
    if (formReady) {
      console.log('LOG FormData:', formData);
    }
  }, [formData, formReady]);

  // Função para escolher uma imagem da biblioteca
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  // Esquema de validação para os campos do formulário
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    raca: Yup.string().required('Campo obrigatório!'),
    idade: Yup.number().required('Campo obrigatório!'),
  });

  // Função para salvar os dados do pet no armazenamento local
  const salvar = async (novoPet) => {
    novoPet.imagem = imagem;

    try {
      // Obtém e parseia os pets já salvos ou inicializa um array vazio
      let petsStorage = await AsyncStorage.getItem('petsAdocao');
      petsStorage = petsStorage ? JSON.parse(petsStorage) : [];

      // Edita ou adiciona o novo pet conforme a ação
      if (acaoTipo === 'editar') {
        const index = petsStorage.findIndex((pet) => pet.id === petAntigo.id);
        petsStorage[index] = novoPet;
      } else if (acaoTipo === 'adicionar') {
        novoPet.id = Date.now();
        petsStorage.push(novoPet);
      }

      // Salva os pets de volta no armazenamento local
      await AsyncStorage.setItem('petsAdocao', JSON.stringify(petsStorage));

      // Chama a função de callback se fornecida na rota
      if (route.params?.onPetAdotado) {
        await route.params.onPetAdotado();
      }

      // Navega de volta
      navigation.goBack();
    } catch (error) {
      // Exibe mensagem de erro em caso de falha no salvamento
      console.error('Erro ao salvar pet:', error);

      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar pet. Tente novamente.',
      });
    }
  };

  // Renderização do componente
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {/* Título do formulário */}
        <Text variant="titleLarge" style={styles.title}>
          {acaoTipo === 'editar' ? 'Editar Pet' : 'Adicionar Pet'}
        </Text>

        {/* Formulário utilizando Formik para gerenciar o estado do formulário */}
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
              {/* Botão para escolher uma imagem da biblioteca */}
              <Button
                style={[styles.button, { backgroundColor: '#bfaee3', width: '80%', alignSelf: 'center' }]}
                labelStyle={{ color: '#FFFFFF' }}
                onPress={handlePickImage}
              >
                Escolher Imagem
              </Button>

              {/* Exibe a imagem selecionada, se houver */}
              {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}

              {/* Campos do formulário */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.nome && errors.nome && styles.errorInput]}
                  mode="outlined"
                  label="Nome"
                  value={values.nome}
                  onChangeText={handleChange('nome')}
                />
                {touched.nome && errors.nome && (
                  <Text style={{ color: 'red', textAlign: 'center', marginTop: -15 }}>{errors.nome}</Text>
                )}

                <TextInput
                  style={[styles.input, touched.raca && errors.raca && styles.errorInput]}
                  mode="outlined"
                  label="Raça"
                  value={values.raca}
                  onChangeText={handleChange('raca')}
                />
                {touched.raca && errors.raca && (
                  <Text style={{ color: 'red', textAlign: 'center', marginTop: -15 }}>{errors.raca}</Text>
                )}

                <TextInput
                  style={[styles.input, touched.idade && errors.idade && styles.errorInput]}
                  mode="outlined"
                  label="Idade"
                  value={values.idade}
                  onChangeText={handleChange('idade')}
                  keyboardType="numeric"
                  onBlur={handleBlur('idade')}
                />
                {touched.idade && errors.idade && (
                  <Text style={{ color: 'red', textAlign: 'center', marginTop: -15 }}>{errors.idade}</Text>
                )}
              </View>

              {/* Botões de navegação */}
              <View style={styles.buttonContainer}>
                {/* Botão para voltar */}
                <Button
                  style={[styles.button, { backgroundColor: '#5fa0c8' }]}
                  labelStyle={{ color: '#FFFFFF' }}
                  onPress={() => navigation.goBack()}
                  icon={({ color, size }) => (
                    <MaterialIcons name="arrow-back" color="#FFFFFF" size={size} />
                  )}
                  mode="contained-tonal"
                >
                  Voltar
                </Button>

                {/* Botão para salvar */}
                <Button
                  style={[styles.button, { backgroundColor: '#008000' }]}
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

// Estilos do componente
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
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
});
