import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StatusBar } from 'react-native';

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
      <View style={{ flex: 1, backgroundColor: '#5ec880', paddingTop: Platform.OS === 'android' ? 10 : 0 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'StackPets') {
                iconName = 'paw';
              } else if (route.name === 'StackAdocao') {
                iconName = 'heart';
              } else if (route.name === 'StackPetshops') { // Adicione esta condição
                iconName = 'md-paw'; // Troque pelo ícone desejado para petshop
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: '#9ddb95',
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
                backgroundColor: '#5ec880',
              },
              headerTitleAlign: 'center',
              headerTintColor: '#FFFFFF',
            }}
          />
          <Tab.Screen
            name="Adocao"
            component={StackAdocao}
            options={{
              tabBarLabel: 'Adoção',
              tabBarIcon: ({ focused, color, size }) => (
                <CustomTabBarLabel focused={focused} label="Adoção" iconName="heart" />
              ),
              headerStyle: {
                backgroundColor: '#5ec880',
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
                <CustomTabBarLabel focused={focused} label="Petshops" iconName="md-paw" />
              ),
              headerStyle: {
                backgroundColor: '#5ec880',
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
