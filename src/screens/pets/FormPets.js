import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

export default function FormPets({ navigation, route }) {
  const { acao, pet: petAntigo } = route.params;
  const [imagem, setImagem] = useState(null);

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    raca: Yup.string().required('Campo obrigatório!'),
    idade: Yup.number().required('Campo obrigatório!'),
  });

  useEffect(() => {
    if (petAntigo) {
      setNome(petAntigo?.nome || '');
      setRaca(petAntigo?.raca || '');
      setIdade(petAntigo?.idade?.toString() || '');
      setImagem(petAntigo?.imagem || null);
    }
  }, [petAntigo]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImagem(result.uri);
    }
  };

  function salvar(novoPet) {
    novoPet.imagem = imagem; // Adiciona a imagem ao objeto do pet

    if (petAntigo) {
      acao(petAntigo, novoPet);
    } else {
      acao(novoPet);
    }

    Toast.show({
      type: 'success',
      text1: 'Pet salvo com sucesso!',
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}

      <Button onPress={handlePickImage}>Escolher Imagem</Button>

      <Text variant="titleLarge" style={styles.title}>
        {petAntigo ? 'Editar Pet' : 'Adicionar Pet'}
      </Text>

      <Formik
        initialValues={{
          nome: petAntigo?.nome || '',
          raca: petAntigo?.raca || '',
          idade: petAntigo?.idade?.toString() || '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => salvar(values)}
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
              <Button style={styles.button} mode="contained-tonal" onPress={() => navigation.goBack()}>
                Voltar
              </Button>

              <Button style={styles.button} mode="contained" onPress={handleSubmit}>
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
  button: {
    flex: 1,
  },
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
});
