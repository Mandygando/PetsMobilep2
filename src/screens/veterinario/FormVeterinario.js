import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Text, TextInput, Checkbox } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text';

export default function FormVeterinario({ navigation, route }) {
  const { acaoTipo = 'adicionar', veterinario: veterinarioAntigo } = route.params || {};

  const [selectedServices, setSelectedServices] = useState(veterinarioAntigo?.servicos || []);

  const [formData, setFormData] = useState({
    nome: veterinarioAntigo?.nome || '',
    horario: veterinarioAntigo?.horario || '',
    telefone: veterinarioAntigo?.telefone || '',
  });

  useEffect(() => {
    if (veterinarioAntigo) {
      setFormData((prev) => ({
        ...prev,
        nome: veterinarioAntigo.nome || '',
        horario: veterinarioAntigo.horario || '',
        telefone: veterinarioAntigo.telefone || '',
      }));
      setSelectedServices(veterinarioAntigo.servicos || []);
    }
  }, [veterinarioAntigo]);

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    horario: Yup.string().required('Campo obrigatório!'),
    telefone: Yup.string().required('Campo obrigatório!'),
  });

  const salvar = async (values) => {
    try {
      const novoVeterinario = {
        id: veterinarioAntigo ? veterinarioAntigo.id : Date.now(),
        nome: values.nome,
        horario: values.horario,
        telefone: values.telefone,
        servicos: selectedServices,
      };

      let veterinariosStorage = await AsyncStorage.getItem('veterinarios');
      veterinariosStorage = veterinariosStorage ? JSON.parse(veterinariosStorage) : [];

      if (acaoTipo === 'editar') {
        const index = veterinariosStorage.findIndex((vet) => vet.id === veterinarioAntigo.id);
        veterinariosStorage[index] = novoVeterinario;
      } else {
        veterinariosStorage.push(novoVeterinario);
      }

      await AsyncStorage.setItem('veterinarios', JSON.stringify(veterinariosStorage));

      if (route.params?.onVeterinarioUpdated) {
        await route.params.onVeterinarioUpdated();
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar Veterinário:', error);
      Alert.alert('Erro ao salvar Veterinário. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ ...styles.title, color: '#000000' }}>
        {acaoTipo === 'editar' ? 'Editando' : 'Adicionar Veterinário'}
      </Text>

      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => salvar(values)}
        enableReinitialize={true}
      >
        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Nome do Veterinário"
              value={values.nome}
              onChangeText={handleChange('nome')}
              onBlur={handleBlur('nome')}
              error={touched.nome && errors.nome}
            />

            {/* Utilizando TextInputMask para aplicar a máscara de horário */}
            <TextInputMask
              style={styles.input}
              type={'datetime'}
              options={{
                format: 'HH:mm',
              }}
              value={values.horario}
              onChangeText={handleChange('horario')}
              onBlur={handleBlur('horario')}
              keyboardType="numeric"
              customTextInput={TextInput}
              customTextInputProps={{ mode: 'outlined', label: 'Horário de Atendimento' }}
              error={touched.horario && errors.horario}
            />

            {/* Adicionando o campo de telefone */}
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Telefone"
              value={values.telefone}
              onChangeText={handleChange('telefone')}
              onBlur={handleBlur('telefone')}
              keyboardType="phone-pad"
              error={touched.telefone && errors.telefone}
            />

            {/* Checkbox para serviços */}
            <View style={styles.input}>
              <Text>Serviços</Text>
              {['Vacinação', 'Castração', 'Consulta', 'Outros'].map((service, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    status={selectedServices.includes(service) ? 'checked' : 'unchecked'}
                    onPress={() => {
                      const services = [...selectedServices];
                      if (services.includes(service)) {
                        services.splice(services.indexOf(service), 1);
                      } else {
                        services.push(service);
                      }
                      setSelectedServices(services);
                    }}
                  />
                  <Text>{service}</Text>
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                icon={({ color }) => (
                  <Icon name="arrow-back" size={20} color={color} style={{ marginRight: 5 }} />
                )}
                onPress={() => navigation.goBack()}
                mode="contained"
                style={{ ...styles.button, backgroundColor: '#5fa0c8' }}
              >
                Voltar
              </Button>

              <View style={{ width: 20 }} />

              <Button
                style={{ ...styles.button, backgroundColor: '#008000' }}
                mode="contained"
                onPress={handleSubmit}
                icon={({ color }) => (
                  <Icon name="save" size={20} color={color} style={{ marginRight: 5 }} />
                )}
              >
                Salvar
              </Button>
            </View>
          </View>
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
    color: '#FFFFFF',
  },
  inputContainer: {
    width: '80%',
    flex: 1,
  },
  input: {
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
