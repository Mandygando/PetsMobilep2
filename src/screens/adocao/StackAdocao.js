import { createStackNavigator } from '@react-navigation/stack';
import ListaAdocao from './ListaAdocao';
import FormAdocao from './FormAdocao';

const Stack = createStackNavigator();

export default function StackAdocao() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ListaAdocao">
      <Stack.Screen name="ListaAdocao" component={ListaAdocao} />
      <Stack.Screen name="FormAdocao" component={FormAdocao} />
    </Stack.Navigator>
  );
}