import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListaVeterinarios from './ListaVeterinarios';
import FormVeterinario from './FormVeterinario';


const Stack = createStackNavigator();

export default function StackVeterinarios() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ListaVeterinarios">
      <Stack.Screen name="ListaVeterinarios" component={ListaVeterinarios} />
      <Stack.Screen name="FormVeterinario" component={FormVeterinario} />
    </Stack.Navigator>
  );
}
