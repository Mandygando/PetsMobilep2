import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StatusBar } from 'react-native';

import Cadastro from '../screens/Cadastro/Cadastro';
import StackPets from '../screens/pets/StackPets';

const Tab = createBottomTabNavigator();

const CustomTabBarLabel = ({ focused, label }) => (
  <View style={{ alignItems: 'center' }}>
    <Ionicons name="paw" size={24} color={focused ? '#FFFFFF' : '#AFAFAF'} />
    <Text style={{ color: focused ? '#FFFFFF' : '#AFAFAF', marginTop: 4 }}>{label}</Text>
  </View>
);

export default function App() {
  return (
    <>
      <StatusBar hidden={false} />
      <View style={{ flex: 1, backgroundColor: '#5ec880', paddingTop: Platform.OS === 'android' ? 10 : 0 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'StackPets') {
                iconName = 'paw';
              } else if (route.name === 'Cadastro') {
                iconName = 'person';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: '#9ddb95', // Cor de fundo da parte inferior (aba de navegação)
            },
          })}
        >
          <Tab.Screen
            name="Pets"
            component={StackPets}
            options={{
              tabBarLabel: 'Pets',
              tabBarIcon: ({ focused, color, size }) => (
                <CustomTabBarLabel focused={focused} label="Pets" />
              ),
              headerStyle: {
                backgroundColor: '#5ec880', // Cor de fundo da barra de navegação
              },
              headerTitleAlign: 'center', // Centralize o texto
              headerTintColor: '#FFFFFF', // Cor do texto
            }}
          />
          <Tab.Screen name="Cadastro" component={Cadastro} />
        </Tab.Navigator>
      </View>
    </>
  );
}
