import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StatusBar } from 'react-native';
import StackClientes from '../screens/clientes/StackClientes';
import StackPets from '../screens/pets/StackPets';
import StackAdocao from '../screens/adocao/StackAdocao';
import StackPetshops from '../screens/petshop/StackPetshops';

const Tab = createBottomTabNavigator();

const CustomTabBarLabel = ({ focused, label, iconName }) => (
  <View style={{ alignItems: 'center' }}>
    <Ionicons name={iconName} size={24} color={focused ? '#FFFFFF' : '#AFAFAF'} />
    <Text style={{ color: focused ? '#FFFFFF' : '#AFAFAF', marginTop: 4 }}>{label}</Text>
  </View>
);

export default function App() {
  return (
    <>
      <StatusBar hidden={false} />
      <View style={{ flex: 1, backgroundColor: '#07024d', paddingTop: Platform.OS === 'android' ? 10 : 0 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'StackPets') {
                iconName = 'paw';
              } else if (route.name === 'StackAdocao') {
                iconName = 'heart';
              } else if (route.name === 'StackPetshops') {
                iconName = 'md-paw';
              } else if (route.name === 'StackClientes') { // Adicione esta condição
                iconName = 'person'; // Troque pelo ícone desejado para clientes
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: '#07024d',
            },
          })}
        >
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
            name="Petshop" // Adicione esta rota
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
        </Tab.Navigator>
      </View>
    </>
  );
}
