import { REQUIRED_CHAIN_ID, REQUIRED_CHAIN_HEX } from '../utils/constants';

export const checkNetwork = async (provider: any) => {
  const network = await provider.getNetwork();
  return network.chainId === REQUIRED_CHAIN_ID;
};

export const switchNetwork = async (provider: any) => {
  await provider.send('wallet_switchEthereumChain', [
    { chainId: REQUIRED_CHAIN_HEX },
  ]);
};
