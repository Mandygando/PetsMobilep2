import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { Card, FAB, IconButton, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AnimatedDelete from '../../components/AnimatedDelete';
import { useFocusEffect } from '@react-navigation/native';

export default function ListaVeterinarios({ navigation }) {
  const [veterinarios, setVeterinarios] = useState([]);
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);

  useEffect(() => {
    loadVeterinarios();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadVeterinarios();
    }, [])
  );

  async function loadVeterinarios() {
    try {
      const response = await AsyncStorage.getItem('veterinarios');
      const veterinariosStorage = response ? JSON.parse(response) : [];
      setVeterinarios(veterinariosStorage);
    } catch (error) {
      console.error('Erro ao carregar veterinários:', error);
    }
  }

  const excluirVeterinario = async (veterinario) => {
    const novosVeterinarios = veterinarios.filter((vet) => vet.id !== veterinario.id);

    try {
      await AsyncStorage.setItem('veterinarios', JSON.stringify(novosVeterinarios));
      setVeterinarios(novosVeterinarios);
      setShowDeleteAnimation(true);
    } catch (error) {
      console.error('Erro ao excluir veterinário:', error);
    }
  };

  const hideDeleteAnimation = () => {
    setShowDeleteAnimation(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={veterinarios}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text>{`Horário: ${item.horario}`}</Text>
              <Text>{`Serviços: ${item.servicos.join(', ')}`}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="pencil"
                onPress={() =>
                  navigation.navigate('FormVeterinario', { acaoTipo: 'editar', veterinario: item, onVeterinarioUpdated: loadVeterinarios })
                }
              />
              <IconButton
                icon={() => <Icon name="delete" size={24} color="#FF0000" />}
                onPress={() => excluirVeterinario(item)}
              />
            </Card.Actions>
          </Card>
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        color="#FFFFFF"
        onPress={() => navigation.navigate('FormVeterinario', { acaoTipo: 'adicionar', onVeterinarioUpdated: loadVeterinarios })}
      />

      {showDeleteAnimation && <AnimatedDelete onDelete={hideDeleteAnimation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e2fe',
  },
  card: {
    margin: 10,
    width: 300,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  fab: {
    position: 'absolute',
    margin: 3,
    left: 0,
    top: 0,
    backgroundColor: '#008000',
  },
});
