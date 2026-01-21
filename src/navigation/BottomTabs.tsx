import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import DepositScreen from '../screen/DepositScreen';
import PortfolioScreen from '../screen/PortfolioScreen';


const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Deposit" component={DepositScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
    </Tab.Navigator>
  );
}