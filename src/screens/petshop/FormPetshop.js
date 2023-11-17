import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Text, TextInput, Checkbox } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FormPetShop({ navigation, route }) {
  const { acaoTipo = 'adicionar', petShop: petShopAntigo } = route.params || {};

  const [selectedServices, setSelectedServices] = useState(petShopAntigo?.servicos || []);
  const [selectedProducts, setSelectedProducts] = useState(petShopAntigo?.produtos || []);

  const [formData, setFormData] = useState({
    nome: petShopAntigo?.nome || '',
  });

  useEffect(() => {
    if (petShopAntigo) {
      setFormData((prev) => ({
        ...prev,
        nome: petShopAntigo.nome || '',
      }));
      setSelectedServices(petShopAntigo.servicos || []);
      setSelectedProducts(petShopAntigo.produtos || []);
    }
  }, [petShopAntigo]);

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório!'),
  });

  const salvar = async (values) => {
    try {
      const novoPetShop = {
        id: petShopAntigo ? petShopAntigo.id : Date.now(),
        nome: values.nome,
        produtos: selectedProducts,
        servicos: selectedServices,
      };

      let petshopsStorage = await AsyncStorage.getItem('petshops');
      petshopsStorage = petshopsStorage ? JSON.parse(petshopsStorage) : [];

      if (acaoTipo === 'editar') {
        const index = petshopsStorage.findIndex((petshop) => petshop.id === petShopAntigo.id);
        petshopsStorage[index] = novoPetShop;
      } else {
        petshopsStorage.push(novoPetShop);
      }

      await AsyncStorage.setItem('petshops', JSON.stringify(petshopsStorage));

      // Chame a função onPetShopUpdated diretamente
      if (route.params?.onPetShopUpdated) {
        await route.params.onPetShopUpdated();
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar PetShop:', error);
      Alert.alert('Erro ao salvar PetShop. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ ...styles.title, color: '#000000' }}>
        {acaoTipo === 'editar' ? 'Editando' : 'Adicionar itens'}
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
              label="Adicione seu nome..."
              value={values.nome}
              onChangeText={handleChange('nome')}
              onBlur={handleBlur('nome')}
              error={touched.nome && errors.nome}
            />

            {/* Checkbox para serviços */}
            <View style={styles.input}>
              <Text>Serviços</Text>
              {['Banho', 'Tosa', 'Outros'].map((service, index) => (
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

            {/* Checkbox para produtos */}
            <View style={styles.input}>
              <Text>Produtos</Text>
              {['Ração', 'Shampoo', 'Roupinhas', 'Coleira', 'Bolinha', 'Osso'].map((product, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    status={selectedProducts.includes(product) ? 'checked' : 'unchecked'}
                    onPress={() => {
                      const products = [...selectedProducts];
                      if (products.includes(product)) {
                        products.splice(products.indexOf(product), 1);
                      } else {
                        products.push(product);
                      }
                      setSelectedProducts(products);
                    }}
                  />
                  <Text>{product}</Text>
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

              {/* Adicionado um espaço horizontal entre os botões */}
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
    marginVertical: 10,
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
