import { WalletKitTypes } from "@reown/walletkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const walletConnectConfig = {
  redirectUrl: "tmvault://",
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
};
