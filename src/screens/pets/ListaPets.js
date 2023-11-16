import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Dialog, FAB, Portal, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function ListaPets({ navigation }) {
  const [pets, setPets] = useState([]);
  const [showModalExcluirPet, setShowModalExcluirPet] = useState(false);
  const [petASerExcluido, setPetASerExcluido] = useState(null);

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    try {
      const response = await AsyncStorage.getItem('pets');
      const petsStorage = response ? JSON.parse(response) : [];
      setPets(petsStorage);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    }
  }

  const exibirModalExcluirPet = (pet) => {
    setPetASerExcluido(pet);
    setShowModalExcluirPet(true);
  };

  const fecharModalExcluirPet = () => {
    setPetASerExcluido(null);
    setShowModalExcluirPet(false);
  };

  const excluirPet = async () => {
    const novosPets = pets.filter((p) => p.id !== petASerExcluido.id);
    try {
      await AsyncStorage.setItem('pets', JSON.stringify(novosPets));
      setPets(novosPets);
      fecharModalExcluirPet();

      Toast.show({
        type: 'success',
        text1: 'Pet excluído com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao excluir pet:', error);

      Toast.show({
        type: 'error',
        text1: 'Erro ao excluir pet. Tente novamente.',
      });
    }
  };

  const editarPet = (pet) => {
    navigation.navigate('FormPets', { acaoTipo: 'editar', pet, onPetUpdated });
  };

  const onPetUpdated = () => {
    loadPets(); // Atualiza a lista de pets após uma edição ou adição
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.imagem }} />
            <Card.Content>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text>{`Raça: ${item.raca}`}</Text>
              <Text>{`Idade: ${item.idade} anos`}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => editarPet(item)}>Editar</Button>
              <Button onPress={() => exibirModalExcluirPet(item)}>Excluir</Button>
            </Card.Actions>
          </Card>
        )}
      />

      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.navigate('FormPets', { acaoTipo: 'adicionar', onPetUpdated })}
      />

      <Portal>
        <Dialog visible={showModalExcluirPet} onDismiss={fecharModalExcluirPet}>
          <Dialog.Title>Excluir Pet</Dialog.Title>
          <Dialog.Content>
            <Text>{`Deseja excluir o pet ${petASerExcluido?.nome}?`}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={fecharModalExcluirPet}>Cancelar</Button>
            <Button onPress={excluirPet}>Excluir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
