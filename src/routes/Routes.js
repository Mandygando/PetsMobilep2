// Importações de bibliotecas e componentes necessários
import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StackClientes from '../screens/clientes/StackClientes';
import StackPets from '../screens/pets/StackPets';
import StackAdocao from '../screens/adocao/StackAdocao';
import StackPetshops from '../screens/petshop/StackPetshops';
import StackVeterinarios from '../screens/veterinario/StackVeterinarios';

// Criação de navegadores de pilha e de abas
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Componente funcional para personalizar o rótulo da barra de abas
const CustomTabBarLabel = ({ focused, label, iconName }) => (
  <View style={{ alignItems: 'center' }}>
    <Ionicons name={iconName} size={24} color={focused ? '#FFFFFF' : '#AFAFAF'} />
    <Text style={{ color: focused ? '#FFFFFF' : '#AFAFAF', marginTop: 4 }}>{label}</Text>
  </View>
);

// Tela de boas-vindas
const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Image
      source={{ uri: 'https://i.pinimg.com/736x/6a/c4/33/6ac433e06f5c86052c298974c40c5903.jpg' }}
      style={styles.backgroundImage}
    />
    <Text style={styles.welcomeText}>
      Bem-vindo ao Girapets
    </Text>
    <Text style={styles.descriptionText}>
      No mundo acelerado de hoje, a vida com animais de estimação é uma experiência enriquecedora, mas encontrar os serviços certos de pet shop e, mais importante ainda, o companheiro perfeito para adoção, pode ser uma tarefa desafiadora. Aqui você encontra isso e muito mais.
    </Text>
    <TouchableOpacity
      style={styles.continueButton}
      onPress={() => navigation.navigate('Main')}
    >
      <Ionicons name="arrow-forward" size={24} color="#FFFFFF" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

// Navegador principal utilizando abas na parte inferior
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        // Define os ícones com base no nome da rota
        if (route.name === 'Pets') {
          iconName = 'paw';
        } else if (route.name === 'Adoção') {
          iconName = 'heart';
        } else if (route.name === 'Petshop') {
          iconName = 'md-paw';
        } else if (route.name === 'Clientes') {
          iconName = 'person';
        } else if (route.name === 'Veterinários') {
          iconName = 'md-medkit';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#07024d',
      },
    })}
  >
    {/* Configurações de cada aba */}
    <Tab.Screen
      name="Pets"
      component={StackPets}
      options={{
        tabBarLabel: 'Pets',
        tabBarIcon: ({ focused, color, size }) => (
          <CustomTabBarLabel focused={focused} label="Pets" iconName="paw" />
        ),
        headerStyle: {
          backgroundColor: '#07024d',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#FFFFFF',
      }}
    />
    <Tab.Screen
      name="Adoção"
      component={StackAdocao}
      options={{
        tabBarLabel: 'Adoção',
        tabBarIcon: ({ focused, color, size }) => (
          <CustomTabBarLabel focused={focused} label="Adoção" iconName="heart" />
        ),
        headerStyle: {
          backgroundColor: '#07024d',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#FFFFFF',
      }}
    />
    <Tab.Screen
      name="Clientes"
      component={StackClientes}
      options={{
        tabBarLabel: 'Clientes',
        tabBarIcon: ({ focused, color, size }) => (
          <CustomTabBarLabel focused={focused} label="Clientes" iconName="person" />
        ),
        headerStyle: {
          backgroundColor: '#07024d',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#FFFFFF',
      }}
    />
    <Tab.Screen
      name="Petshop"
      component={StackPetshops}
      options={{
        tabBarLabel: 'Petshop',
        tabBarIcon: ({ focused, color, size }) => (
          <CustomTabBarLabel focused={focused} label="Petshop" iconName="md-paw" />
        ),
        headerStyle: {
          backgroundColor: '#07024d',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#FFFFFF',
      }}
    />
    <Tab.Screen
      name="Veterinários" // Adicione esta rota
      component={StackVeterinarios}
      options={{
        tabBarLabel: 'Veterinários',
        tabBarIcon: ({ focused, color, size }) => (
          <CustomTabBarLabel focused={focused} label="Veterinário" iconName="md-medkit" />
        ),
        headerStyle: {
          backgroundColor: '#07024d',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#FFFFFF',
      }}
    />
  </Tab.Navigator>
);

// Componente principal da aplicação
const App = () => (
  <NavigationContainer>
    <View style={{ flex: 1 }}>
      {/* Navegação em pilha com telas de boas-vindas e principal */}
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </View>
  </NavigationContainer>
);

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#07024d',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 60,
    marginTop: -40,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 23,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 25,
    textShadowColor: '#000000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  continueButton: {
    backgroundColor: '#FF6347',
    borderRadius: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default App;
