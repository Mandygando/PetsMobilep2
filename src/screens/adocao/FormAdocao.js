import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function FormAdocao({ navigation, route }) {
  // Extrai informações da rota
  const { acaoTipo, pet: petAntigo, onPetAdotado } = route.params;

  // Estado para armazenar a imagem selecionada
  const [imagem, setImagem] = useState(null);

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    raca: '',
    idade: '',
  });

  // Efeito para preencher o formulário com dados existentes ao editar
  useEffect(() => {
    console.log('petAntigo:', petAntigo);
  
    if (petAntigo && petAntigo.nome) {
      setFormData((prevData) => ({
        ...prevData,
        nome: petAntigo.nome || '',
        raca: petAntigo.raca || '',
        idade: petAntigo.idade ? petAntigo.idade.toString() : '',
      }));
      setImagem(petAntigo.imagem);
    }
  }, [petAntigo]);

  // Função para escolher uma imagem da galeria
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImagem(result.assets[0].uri);
    }
  };

  // Esquema de validação com Yup
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    raca: Yup.string().required('Campo obrigatório!'),
    idade: Yup.number().required('Campo obrigatório!'),
  });

  // Função para salvar os dados do pet
  const salvar = async (novoPet) => {
    novoPet.imagem = imagem;

    try {
      // Obter pets salvos no AsyncStorage
      let petsStorage = await AsyncStorage.getItem('petsAdocao');
      petsStorage = petsStorage ? JSON.parse(petsStorage) : [];

      // Atualizar ou adicionar novo pet
      if (acaoTipo === 'editar') {
        const index = petsStorage.findIndex((pet) => pet.id === petAntigo.id);
        petsStorage[index] = novoPet;
      } else if (acaoTipo === 'adicionar') {
        novoPet.id = Date.now();
        petsStorage.push(novoPet);
      }

      // Salvar pets de volta no AsyncStorage
      await AsyncStorage.setItem('petsAdocao', JSON.stringify(petsStorage));

      // Exibir mensagem de sucesso
      Toast.show({
        type: 'success',
        text1: 'Pet salvo com sucesso!',
      });

      // Chamar a função de retorno se fornecida
      if (onPetAdotado) {
        onPetAdotado();
      }

      // Navegar de volta
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar pet:', error);

      // Exibir mensagem de erro
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar pet. Tente novamente.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {acaoTipo === 'editar' ? 'Editar Pet' : 'Adicionar Pet'}
      </Text>

      {/* Formulário usando Formik */}
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          salvar(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
          <>
            {/* Botão para escolher uma imagem */}
            <Button
              style={[styles.button, { backgroundColor: '#bfaee3', width: '80%', alignSelf: 'center' }]}
              labelStyle={{ color: '#FFFFFF' }}
              onPress={handlePickImage}
            >
              Escolher Imagem
            </Button>

            {/* Exibir imagem selecionada */}
            {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}

            {/* Campos de entrada para nome, raça e idade */}
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
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.nome}</Text>
              )}

              <TextInput
                style={styles.input}
                mode="outlined"
                label="Raça"
                value={values.raca}
                onChangeText={handleChange('raca')}
                onBlur={handleBlur('raca')}
                error={touched.raca && errors.raca ? true : false}
              />
              {touched.raca && errors.raca && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.raca}</Text>
              )}

              <TextInput
                style={styles.input}
                mode="outlined"
                label="Idade"
                value={values.idade}
                onChangeText={handleChange('idade')}
                onBlur={handleBlur('idade')}
                keyboardType="numeric"
                error={touched.idade && errors.idade ? true : false}
              />
              {touched.idade && errors.idade && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.idade}</Text>
              )}
            </View>

            {/* Botões de navegação e salvar */}
            <View style={styles.buttonContainer}>
              <Button
                style={[styles.button, { backgroundColor: '#5fa0c8' }]}
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
  );
}

const styles = StyleSheet.create({
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
