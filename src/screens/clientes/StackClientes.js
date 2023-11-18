import { createStackNavigator } from '@react-navigation/stack';
import ListaClientes from './ListaClientes';
import FormClientes from './FormClientes';


const Stack = createStackNavigator();

export default function StackClientes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ListaClientes">
      <Stack.Screen name="ListaClientes" component={ListaClientes} />
      <Stack.Screen name="FormClientes" component={FormClientes} />
    </Stack.Navigator>
  );
}
