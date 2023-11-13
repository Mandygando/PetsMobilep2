import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Dialog, FAB, Portal, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function ListaPets({ navigation }) {
  const [pets, setPets] = useState([]);
  const [showModalExcluirPet, setShowModalExcluirPet] = useState(false);
  const [petASerExcluido, setPetASerExcluido] = useState(null);

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    const response = await AsyncStorage.getItem('pets');
    const petsStorage = response ? JSON.parse(response) : [];
    setPets(petsStorage);
  }

  const showModal = () => setShowModalExcluirPet(true);

  const hideModal = () => setShowModalExcluirPet(false);

  async function adicionarPet(pet) {
    let novaListaPets = pets;
    novaListaPets.push(pet);
    await AsyncStorage.setItem('pets', JSON.stringify(novaListaPets));
    setPets(novaListaPets);
  }

  async function editarPet(petAntigo, novosDados) {
    const novaListaPets = pets.map((pet) => {
      if (pet === petAntigo) {
        return novosDados;
      } else {
        return pet;
      }
    });

    await AsyncStorage.setItem('pets', JSON.stringify(novaListaPets));
    setPets(novaListaPets);
  }

  async function excluirPet(pet) {
    const novaListaPets = pets.filter((p) => p !== pet);
    await AsyncStorage.setItem('pets', JSON.stringify(novaListaPets));
    setPets(novaListaPets);
    Toast.show({
      type: 'success',
      text1: 'Pet excluído com sucesso!',
    });
  }

  function handleExcluirPet() {
    excluirPet(petASerExcluido);
    setPetASerExcluido(null);
    hideModal();
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Lista de Pets
      </Text>

      <FlatList
        style={styles.list}
        data={pets}
        renderItem={({ item }) => (
          <Card mode="outlined" style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium">{item?.nome}</Text>
                <Text variant="bodyLarge">Raça: {item?.raca}</Text>
                <Text variant="bodyLarge">Idade: {item?.idade} anos</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.push('FormPets', { acao: editarPet, pet: item })
                }
              >
                Editar
              </Button>
              <Button
                onPress={() => {
                  setPetASerExcluido(item);
                  showModal();
                }}
              >
                Excluir
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      {/* Botão Flutuante */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.push('FormPets', { acao: adicionarPet })}
      />

      {/* Modal Excluir Pet */}
      <Portal>
        <Dialog visible={showModalExcluirPet} onDismiss={hideModal}>
          <Dialog.Title>Atenção!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Tem certeza que deseja excluir este pet?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideModal}>Voltar</Button>
            <Button onPress={handleExcluirPet}>Tenho Certeza</Button>
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
  title: {
    fontWeight: 'bold',
    margin: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  list: {
    width: '90%',
  },
  card: {
    marginTop: 15,
  },
  cardContent: {
    flexDirection: 'row',
    backgroundColor: '#e1e1e1',
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
});
