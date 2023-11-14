import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import React from 'react';

import Cadastro from '../screens/Cadastro/Cadastro';
import StackPets from '../screens/pets/StackPets';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'StackPets') {
            iconName = 'paw';
          } else if (route.name === 'Cadastro') {
            iconName = 'person';
          }

          // Você pode retornar qualquer componente de ícone aqui
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: [{ display: 'flex' }, null],
      })}
    >
      <Tab.Screen name="StackPets" component={StackPets} />
      <Tab.Screen name="Cadastro" component={Cadastro} />
    </Tab.Navigator>
  );
}
