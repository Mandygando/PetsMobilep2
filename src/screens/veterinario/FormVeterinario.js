import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Text, TextInput, Checkbox } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text';

export default function FormVeterinario({ navigation, route }) {
  // Extrai as propriedades de ação e dados do veterinário da rota
  const { acaoTipo = 'adicionar', veterinario: veterinarioAntigo } = route.params || {};

  // Estados para armazenar serviços selecionados, dados do formulário
  const [selectedServices, setSelectedServices] = useState(veterinarioAntigo?.servicos || []);
  const [formData, setFormData] = useState({
    nome: veterinarioAntigo?.nome || '',
    horario: veterinarioAntigo?.horario || '',
    telefone: veterinarioAntigo?.telefone || '',
  });

  // Efeito para atualizar os estados ao editar um veterinário existente
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

  // Esquema de validação Yup para os campos do formulário
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
    horario: Yup.string()
      .required('Campo obrigatório!')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido'),
    telefone: Yup.string()
      .required('Campo obrigatório!')
      .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato de telefone inválido'),
  });

  const salvar = async (values) => {
    try {
      // Cria um objeto novoVeterinario com os dados do formulário e serviços selecionados
      const novoVeterinario = {
        id: veterinarioAntigo ? veterinarioAntigo.id : Date.now(),
        nome: values.nome,
        horario: values.horario,
        telefone: values.telefone,
        servicos: selectedServices,
      };

      // Obtém os veterinários armazenados e adiciona o novo veterinário
      let veterinariosStorage = await AsyncStorage.getItem('veterinarios');
      veterinariosStorage = veterinariosStorage ? JSON.parse(veterinariosStorage) : [];

      if (acaoTipo === 'editar') {
        const index = veterinariosStorage.findIndex((vet) => vet.id === veterinarioAntigo.id);
        veterinariosStorage[index] = novoVeterinario;
      } else {
        veterinariosStorage.push(novoVeterinario);
      }

      // Salva os veterinários de volta no AsyncStorage
      await AsyncStorage.setItem('veterinarios', JSON.stringify(veterinariosStorage));
      // Chama a função de atualização se fornecida nas propriedades de rota
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
              label="Nome"
              value={values.nome}
              onChangeText={handleChange('nome')}
              onBlur={handleBlur('nome')}
              error={touched.nome && errors.nome}
            />

            {/* Utiliza TextInputMask para aplicar a máscara de horário */}
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

            <TextInputMask
              style={styles.input}
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) ',
              }}
              value={values.telefone}
              onChangeText={handleChange('telefone')}
              onBlur={handleBlur('telefone')}
              keyboardType="phone-pad"
              customTextInput={TextInput}
              customTextInputProps={{ mode: 'outlined', label: 'Telefone' }}
              error={touched.telefone && errors.telefone}
            />

            {/* Checkbox para seleção de serviços */}
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
