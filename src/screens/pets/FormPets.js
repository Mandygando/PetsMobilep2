import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

export default function FormPets({ navigation, route }) {
    const { acao, pet: petAntigo } = route.params;

    const validationSchema = Yup.object().shape({
        nome: Yup.string().required('Campo obrigatório!'),
        raca: Yup.string().required('Campo obrigatório!'),
        idade: Yup.number().required('Campo obrigatório!'),
    });

    useEffect(() => {
        if (petAntigo) {
            setNome(petAntigo.nome);
            setRaca(petAntigo.raca);
            setIdade(petAntigo.idade.toString());
        }
    }, [petAntigo]);

    function salvar(novoPet) {
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
            <Text variant="titleLarge" style={styles.title}>
                {petAntigo ? 'Editar Pet' : 'Adicionar Pet'}
            </Text>

            <Formik
                initialValues={{
                    nome: '',
                    raca: '',
                    idade: '',
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
                            <Button
                                style={styles.button}
                                mode="contained-tonal"
                                onPress={() => navigation.goBack()}
                            >
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
});
