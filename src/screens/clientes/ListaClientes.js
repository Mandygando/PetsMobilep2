import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, FAB, IconButton, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedDelete from '../../components/AnimatedDelete';

export default function ListaClientes({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  async function loadClientes() {
    try {
      const response = await AsyncStorage.getItem('clientes');
      const clientesStorage = response ? JSON.parse(response) : [];
      setClientes(clientesStorage);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }

  const excluirCliente = async (cliente) => {
    const novosClientes = clientes.filter((c) => c.id !== cliente.id);

    try {
      await AsyncStorage.setItem('clientes', JSON.stringify(novosClientes));
      setClientes(novosClientes);
      setShowDeleteAnimation(true);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const onClienteUpdated = () => {
    loadClientes();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={clientes}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text>{`Nome do Pet: ${item.nomePet}`}</Text>
              <Text>{`CPF: ${item.cpf}`}</Text>
              <Text>{`Endereço: ${item.endereco || ''}`}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton icon="pencil" onPress={() => navigation.navigate('FormClientes', { acaoTipo: 'editar', cliente: item, onClienteUpdated })} />
              <IconButton icon="delete" color="#FF0000" onPress={() => excluirCliente(item)} />
            </Card.Actions>
          </Card>
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        color="#FFFFFF"
        onPress={() => navigation.navigate('FormClientes', { acaoTipo: 'adicionar', onClienteUpdated })}
      />

      {showDeleteAnimation && <AnimatedDelete onDelete={() => setShowDeleteAnimation(false)} />}
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

