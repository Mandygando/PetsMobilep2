import { createStackNavigator } from '@react-navigation/stack';
import ListaPets from './ListaPets';
import FormPets from './FormPets';

const Stack = createStackNavigator();

export default function StackPets() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ListaPets">
      <Stack.Screen name="ListaPets" component={ListaPets} />
      <Stack.Screen name="FormPets" component={FormPets} />
    </Stack.Navigator>
  );
}
