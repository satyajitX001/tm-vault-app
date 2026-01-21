import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { WalletConnectModal } from '@walletconnect/modal-react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { walletConnectConfig } from './src/web3/walletConnect';
import BottomTabs from './src/navigation/BottomTabs';
import MyTabs from './src/navigation/BottomTabs';
import HomeScreen from './src/screen/HomeScreen';
import DepositScreen from './src/screen/DepositScreen';
import PortfolioScreen from './src/screen/PortfolioScreen';


export default function App() {

  const Navigation = createStaticNavigation(MyTabs);


  return (
    <>
    {/* <SafeAreaView style={{ flex: 1 }}>
        <Navigation />
        
      </SafeAreaView> */}
      <HomeScreen/>
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
