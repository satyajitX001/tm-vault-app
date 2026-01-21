import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import DepositScreen from '../screen/DepositScreen';
import PortfolioScreen from '../screen/PortfolioScreen';


const Tab = createBottomTabNavigator();

// export default function BottomTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Vaults" component={HomeScreen} />
//       <Tab.Screen name="Deposit" component={DepositScreen} />
//       <Tab.Screen name="Portfolio" component={PortfolioScreen} />
//     </Tab.Navigator>
//   );
// }

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Deposit: DepositScreen,
    Portfolio: PortfolioScreen,
  },
});

export default  MyTabs