import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Campo obrigatório!'),
  raca: Yup.string().required('Campo obrigatório!'),
  idade: Yup.number().required('Campo obrigatório!'),
});

export default function FormPets({ navigation, route }) {
  const { acaoTipo, pet: petAntigo, onPetUpdated } = route.params;
  const [imagem, setImagem] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    raca: '',
    idade: '',
  });

  useEffect(() => {
    if (petAntigo) {
      setFormData({
        nome: petAntigo.nome,
        raca: petAntigo.raca,
        idade: petAntigo.idade.toString(),
      });
      setImagem(petAntigo.imagem);
    }
  }, [petAntigo]);

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

      Toast.show({
        type: 'success',
        text1: 'Pet salvo com sucesso!',
      });

      onPetUpdated(); // Atualiza a lista de pets no componente pai

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar pet:', error);

      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar pet. Tente novamente.',
      });
    }
  };

  return (
    <View style={styles.container}>
      {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}

      <Button onPress={handlePickImage}>Escolher Imagem</Button>

      <Text variant="titleLarge" style={styles.title}>
        {acaoTipo === 'editar' ? 'Editar Pet' : 'Adicionar Pet'}
      </Text>

      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          salvar(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
          <>
            <View style={sharedStyles.inputContainer}>
              <TextInput
                style={sharedStyles.input}
                mode="outlined"
                label="Nome"
                value={values.nome}
                onChangeText={handleChange('nome')}
                onBlur={handleBlur('nome')}
                error={errors.nome ? true : false}
              />
              {touched.nome && errors.nome && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.nome}</Text>
              )}

              <TextInput
                style={sharedStyles.input}
                mode="outlined"
                label="Raça"
                value={values.raca}
                onChangeText={handleChange('raca')}
                onBlur={handleBlur('raca')}
                error={errors.raca ? true : false}
              />
              {touched.raca && errors.raca && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.raca}</Text>
              )}

              <TextInput
                style={sharedStyles.input}
                mode="outlined"
                label="Idade"
                value={values.idade}
                onChangeText={handleChange('idade')}
                onBlur={handleBlur('idade')}
                keyboardType="numeric"
                error={errors.idade ? true : false}
              />
              {touched.idade && errors.idade && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.idade}</Text>
              )}
            </View>

            <View style={sharedStyles.buttonContainer}>
              <Button style={sharedStyles.button} mode="contained-tonal" onPress={() => navigation.goBack()}>
                Voltar
              </Button>

              <Button style={sharedStyles.button} mode="contained" onPress={handleSubmit}>
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
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
});

const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
  inputContainer: {
    width: '90%',
    flex: 1,
  },
  input: {
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginBottom: 10,
  },
});
