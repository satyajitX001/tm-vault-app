import { ethers } from 'ethers';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

export const getProviderAndSigner = async (walletProvider: any) => {
  const provider = new ethers.BrowserProvider(walletProvider);
  const signer = await provider.getSigner();
  return { provider, signer };
};
