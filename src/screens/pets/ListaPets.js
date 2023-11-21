// Importação de módulos e componentes necessários
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

  // Função assíncrona para carregar a lista de pets do AsyncStorage
  async function loadPets() {
    try {
      const response = await AsyncStorage.getItem('pets');
      // Se houver dados salvos, converte de JSON para objeto; senão, inicializa com array vazio
      const petsStorage = response ? JSON.parse(response) : [];
      setPets(petsStorage);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    }
  }

  const excluirPet = async (pet) => {
    // Filtra os pets, removendo o que possui o mesmo ID do pet a ser excluído
    const novosPets = pets.filter((p) => p.id !== pet.id);
    try {
      await AsyncStorage.setItem('pets', JSON.stringify(novosPets));
      // Atualiza o estado local 'pets' e ativa a animação de exclusão
      setPets(novosPets);
      setShowDeleteAnimation(true);
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
    }
  };

  const onPetUpdated = () => {
    // Chama a função de carregar pets para atualizar a lista
    loadPets();
  };

  // Função para esconder a animação de exclusão
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
              <Text>{`Tutor: ${item.tutor || ''}`}</Text>
            </Card.Content>

            {/* Botões de edição e exclusão para cada pet */}
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

      {/* Renderiza a animação de exclusão */}
      {showDeleteAnimation && <AnimatedDelete onDelete={hideDeleteAnimation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e2fe', // Cor de fundo da tela
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
    backgroundColor: '#008000', // Cor de fundo do botão
  },
});
