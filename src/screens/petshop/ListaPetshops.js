import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { Card, FAB, IconButton, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AnimatedDelete from '../../components/AnimatedDelete';
import { useFocusEffect } from '@react-navigation/native';  // Adicionado import

export default function ListaPetshops({ navigation }) {
  const [petshops, setPetshops] = useState([]);
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);

  useEffect(() => {
    loadPetshops();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadPetshops();  // Atualizado para chamar loadPetshops() quando a tela está focada
    }, [])
  );

  async function loadPetshops() {
    try {
      const response = await AsyncStorage.getItem('petshops');
      const petshopsStorage = response ? JSON.parse(response) : [];
      setPetshops(petshopsStorage);
    } catch (error) {
      console.error('Erro ao carregar petshops:', error);
    }
  }

  const excluirPetshop = async (petshop) => {
    const novosPetshops = petshops.filter((p) => p.id !== petshop.id);

    try {
      await AsyncStorage.setItem('petshops', JSON.stringify(novosPetshops));
      setPetshops(novosPetshops);
      setShowDeleteAnimation(true);
    } catch (error) {
      console.error('Erro ao excluir petshop:', error);
    }
  };

  const hideDeleteAnimation = () => {
    setShowDeleteAnimation(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={petshops}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text>{`Produtos: ${item.produtos}`}</Text>
              <Text>{`Serviços: ${item.servicos}`}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="pencil"
                onPress={() =>
                  navigation.navigate('FormPetshop', { acaoTipo: 'editar', petShop: item, onPetshopUpdated: loadPetshops })
                }
              />
              <IconButton
                icon={() => <Icon name="delete" size={24} color="#FF0000" />}
                onPress={() => excluirPetshop(item)}
              />
            </Card.Actions>
          </Card>
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        color="#FFFFFF"
        onPress={() => navigation.navigate('FormPetshop', { acaoTipo: 'adicionar', onPetShopUpdated: loadPetshops })}
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
    backgroundColor: '#f4fff4',
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
