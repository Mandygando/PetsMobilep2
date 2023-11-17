import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, FAB, IconButton, Text, Modal, Portal, Button, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AnimatedDeleteAdocao from '../../components/AnimatedDeleteAdocao';

// Componente para o item da lista
const PetCard = ({ pet, onEdit, onDelete }) => (
  <Card style={styles.card}>
    <Card.Cover source={{ uri: pet.imagem }} />
    <Card.Content>
      <Text style={styles.cardTitle}>{pet.nome}</Text>
      <Text>{`Raça: ${pet.raca}`}</Text>
      <Text>{`Idade: ${pet.idade} ${pet.idade === 1 ? 'ano' : 'anos'}`}</Text>
    </Card.Content>
    <Card.Actions>
      <IconButton icon="pencil" onPress={onEdit} />
      <IconButton icon={() => <Icon name="favorite" size={24} color="#FF0000" />} onPress={onDelete} />
    </Card.Actions>
  </Card>
);

const ListaAdocao = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);
  const [deletedPet, setDeletedPet] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    try {
      const response = await AsyncStorage.getItem('petsAdocao');
      const petsStorage = response ? JSON.parse(response) : [];
      setPets(petsStorage);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    }
  }

  const excluirPet = async (pet) => {
    const novosPets = pets.filter((p) => p.id !== pet.id);

    try {
      await AsyncStorage.setItem('petsAdocao', JSON.stringify(novosPets));
      setDeletedPet(pet);
      setShowDeleteAnimation(true);
      setPets(novosPets);
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
    }
  };

  const onPetAdotado = () => {
    loadPets(); // Atualiza a lista de pets após uma edição ou adição
  };

  const hideDeleteAnimation = () => {
    setShowDeleteAnimation(false);
    setDeletedPet(null);
  };

  const showLocationDetails = () => {
    setShowLocationModal(true);
  };

  const hideLocationModal = () => {
    setShowLocationModal(false);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <FlatList
          data={pets}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onEdit={() => navigation.navigate('FormAdocao', { acaoTipo: 'editar', pet: item, onPetAdotado })}
              onDelete={() => excluirPet(item)}
            />
          )}
        />

        <FAB
          style={styles.fab}
          icon="plus"
          color="#FFFFFF"
          onPress={() => navigation.navigate('FormAdocao', { acaoTipo: 'adicionar', onPetAdotado })}
        />

        {showDeleteAnimation && (
          <AnimatedDeleteAdocao
            onDelete={hideDeleteAnimation}
            onShowLocationDetails={showLocationDetails}
            pet={deletedPet}
          />
        )}

        <Portal>
          <Modal visible={showLocationModal} onDismiss={hideLocationModal}>
            <View style={styles.locationModal}>
              <Button onPress={hideLocationModal}>Fechar</Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dff2d9', // Cor de fundo da tela
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
  locationModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export default ListaAdocao;
