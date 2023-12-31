import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function FormPets({ navigation, route }) {
  const { acaoTipo, pet: petAntigo } = route.params;

  const [imagem, setImagem] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    raca: '',
    idade: '',
    tutor: '', // Adicionando o campo para o tutor
  });

  useEffect(() => {
    if (petAntigo) {
      setFormData({
        nome: petAntigo.nome,
        raca: petAntigo.raca,
        idade: petAntigo.idade ? petAntigo.idade.toString() : '',
        tutor: petAntigo.tutor || '', // Preenchendo o campo tutor se existir no petAntigo
      });
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

    if (!result.canceled) {
      setImagem(result.uri);
    }
  };

  // Esquema de validação Yup para os campos do formulário
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    raca: Yup.string().required('Campo obrigatório!'),
    idade: Yup.number().required('Campo obrigatório!'),
    tutor: Yup.string().required('Campo obrigatório!'),
  });

  // Função para salvar as informações do pet no AsyncStorage
  const salvar = async (novoPet) => {
    novoPet.imagem = imagem;
  
    try {
      let petsStorage = await AsyncStorage.getItem('pets');
      petsStorage = petsStorage ? JSON.parse(petsStorage) : [];
  
      if (acaoTipo === 'editar') {
        const index = petsStorage.findIndex((pet) => pet.id === petAntigo.id);
        petsStorage[index] = novoPet;
      } else {
        novoPet.id = Date.now();
        petsStorage.push(novoPet);
      }
  
      await AsyncStorage.setItem('pets', JSON.stringify(petsStorage));
  
      navigation.goBack();
  
      // Chama a função de atualização do pet na tela anterior
      if (acaoTipo === 'editar' && route.params.onPetUpdated) {
        route.params.onPetUpdated();
      } else if (acaoTipo === 'adicionar' && route.params.onPetUpdated) {
        route.params.onPetUpdated();
      }
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
  
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar pet. Tente novamente.',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          {acaoTipo === 'editar' ? 'Editar Pet' : 'Adicionar Pet'}
        </Text>

        {/* Formik para gerenciar o estado do formulário */}
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
              {/* Botão para escolher imagem da galeria */}
              <Button
                style={[styles.button, { backgroundColor: '#bfaee3', width: '80%', alignSelf: 'center' }]}
                labelStyle={{ color: '#FFFFFF' }}
                onPress={handlePickImage}
              >
                Escolher Imagem
              </Button>

              {/* Exibir imagem escolhida */}
              {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}

              {/* Container para os campos de entrada */}
              <View style={styles.inputContainer}>
                {/* Campo de entrada para o nome */}
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

                {/* Campo de entrada para a raça */}
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

                {/* Campo de entrada para a idade */}
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

                {/* Campo de entrada para o tutor */}
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Tutor"
                  value={values.tutor}
                  onChangeText={handleChange('tutor')}
                  onBlur={handleBlur('tutor')}
                  error={touched.tutor && errors.tutor ? true : false}
                />
                {touched.tutor && errors.tutor && (
                  <Text style={{ color: 'red', textAlign: 'center' }}>{errors.tutor}</Text>
                )}
              </View>

              {/* Container para os botões de navegação e salvamento */}
              <View style={styles.buttonContainer}>
                {/* Botão "Voltar" */}
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

                {/* Botão "Salvar" */}
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
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
