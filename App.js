import 'react-native-gesture-handler';import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
import { PaperProvider } from 'react-native-paper';
import Routes from './src/routes/Routes';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <PaperProvider>
        <Routes />
      <Toast />
    </PaperProvider>
  );
}
