import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screen/HomeScreen';
import { WalletConnectModal } from '@walletconnect/modal-react-native';
import { walletConnectConfig } from './src/web3/walletConnect';


export default function App() {
  return (
    <>
    <HomeScreen />
      <WalletConnectModal {...walletConnectConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
