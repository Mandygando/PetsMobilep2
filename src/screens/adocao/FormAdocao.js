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
  const { acaoTipo, pet: petAntigo } = route.params;
  const [imagem, setImagem] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    raca: '',
    idade: '',
  });
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    console.log('LOG Pet Antigo (antes):', petAntigo);

    if (petAntigo) {
      console.log('LOG Pet Antigo (dentro):', petAntigo);

      setFormData((prevData) => ({
        ...prevData,
        nome: petAntigo.nome || '',
        raca: petAntigo.raca || '',
        idade: petAntigo.idade ? petAntigo.idade.toString() : '',
      }));
      setImagem(petAntigo.imagem);
      setFormReady(true); // Marcar o formulário como pronto após a atualização dos dados
    }
  }, [petAntigo]);

  useEffect(() => {
    if (formReady) {
      console.log('LOG FormData:', formData);
    }
  }, [formData, formReady]);

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

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    raca: Yup.string().required('Campo obrigatório!'),
    idade: Yup.number().required('Campo obrigatório!'),
  });

  const salvar = async (novoPet) => {
    novoPet.imagem = imagem;

    try {
      let petsStorage = await AsyncStorage.getItem('petsAdocao');
      petsStorage = petsStorage ? JSON.parse(petsStorage) : [];

      if (acaoTipo === 'editar') {
        const index = petsStorage.findIndex((pet) => pet.id === petAntigo.id);
        petsStorage[index] = novoPet;
      } else if (acaoTipo === 'adicionar') {
        novoPet.id = Date.now();
        petsStorage.push(novoPet);
      }

      await AsyncStorage.setItem('petsAdocao', JSON.stringify(petsStorage));

      Toast.show({
        type: 'success',
        text1: 'Pet salvo com sucesso!',
      });

      // Chame a função onPetAdotado diretamente
      if (route.params?.onPetAdotado) {
        await route.params.onPetAdotado();
      }

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
      <Text variant="titleLarge" style={styles.title}>
        {acaoTipo === 'editar' ? 'Editar Pet' : 'Adicionar Pet'}
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
            <Button
              style={[styles.button, { backgroundColor: '#bfaee3', width: '80%', alignSelf: 'center' }]}
              labelStyle={{ color: '#FFFFFF' }}
              onPress={handlePickImage}
            >
              Escolher Imagem
            </Button>

            {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
