import { createStackNavigator } from '@react-navigation/stack';
import ListaPetshops from './ListaPetshops';
import FormPetshop from './FormPetshop';

const Stack = createStackNavigator();

export default function StackPetshops() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ListaPetshops">
      <Stack.Screen name="ListaPetshops" component={ListaPetshops} />
      <Stack.Screen name="FormPetshop" component={FormPetshop} />
    </Stack.Navigator>
  );
}
