import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, FAB, IconButton, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AnimatedDelete from '../../components/AnimatedDelete';

export default function ListaPets({ navigation }) {
  const [pets, setPets] = useState([]);
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);

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

  const excluirPet = async (pet) => {
    const novosPets = pets.filter((p) => p.id !== pet.id);

    try {
      await AsyncStorage.setItem('pets', JSON.stringify(novosPets));
      setPets(novosPets);
      setShowDeleteAnimation(true);
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
    }
  };

  const onPetUpdated = () => {
    loadPets(); // Atualiza a lista de pets após uma edição ou adição
  };

  const hideDeleteAnimation = () => {
    setShowDeleteAnimation(false);
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
              <IconButton icon="pencil" onPress={() => navigation.navigate('FormPets', { acaoTipo: 'editar', pet: item, onPetUpdated })} />
              <IconButton icon={() => <Icon name="delete" size={24} color="#FF0000" />} onPress={() => excluirPet(item)} />
            </Card.Actions>
          </Card>
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        color="#FFFFFF"
        onPress={() => navigation.navigate('FormPets', { acaoTipo: 'adicionar', onPetUpdated })}
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
    backgroundColor: '#f4fff4', // Cor de fundo da tela
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
    left: 0, // Mova para o canto superior esquerdo definindo 'left' como 0
    top: 0, // Mova para o canto superior definindo 'top' como 0
    backgroundColor: '#008000', // Cor de fundo do botão
  },
});
