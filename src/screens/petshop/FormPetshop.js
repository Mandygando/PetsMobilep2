import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Text, TextInput, IconButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FormPetShop({ navigation, route }) {
    const { acaoTipo = 'adicionar', petShop: petShopAntigo, onPetShopUpdated } = route.params || {};

    const [selectedService, setSelectedService] = useState(petShopAntigo?.servicos || '');
    const [selectedProduct, setSelectedProduct] = useState(petShopAntigo?.produtos || '');

    const [formData, setFormData] = useState({
        nome: petShopAntigo?.nome || '',
    });

    useEffect(() => {
        if (petShopAntigo) {
            setFormData((prev) => ({
                ...prev,
                nome: petShopAntigo.nome || '',
            }));
            setSelectedService(petShopAntigo.servicos || '');
            setSelectedProduct(petShopAntigo.produtos || '');
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
                produtos: selectedProduct,
                servicos: selectedService,
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

            if (onPetShopUpdated) {
                await onPetShopUpdated();
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
                {acaoTipo === 'editar' ? 'Editar PetShop' : 'Adicionar itens'}
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

                        {/* Picker para serviços */}
                        <View style={styles.input}>
                            <Text>Serviços</Text>
                            <Picker
                                selectedValue={selectedService}
                                onValueChange={(itemValue) => setSelectedService(itemValue)}
                                mode="dropdown"
                            >
                                <Picker.Item label="Selecione o serviço" value="" />
                                {['Banho', 'Tosa', 'Outros'].map((service, index) => (
                                    <Picker.Item key={index} label={service} value={service} />
                                ))}
                            </Picker>
                        </View>

                        {/* Picker para produtos */}
                        <View style={styles.input}>
                            <Text>Produtos</Text>
                            <Picker
                                selectedValue={selectedProduct}
                                onValueChange={(itemValue) => setSelectedProduct(itemValue)}
                                mode="dropdown"
                            >
                                <Picker.Item label="Selecione o produto" value="" />
                                {['Ração', 'Shampoo', 'Roupinhas', 'Coleira', 'Bolinha', 'Osso'].map((product, index) => (
                                    <Picker.Item key={index} label={product} value={product} />
                                ))}
                            </Picker>
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
        marginVertical: 90,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
