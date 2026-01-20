import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native"
import { checkNetwork, switchNetwork } from "../web3/network";
import { approveAndDeposit, TxStatus } from "../web3/approveDeposit";
import { getProviderAndSigner } from '../web3/provider';
import { VaultCard, VaultCardProps } from "../component/VaultCard";

const vaults: VaultCardProps[] = [
    {

        name: 'Stable Vault',
        type: 'Stable',
        risk: 'Low',
        apy: '6–8%',
        tvl: '$12M',
    },
    {

        name: 'Growth Vault',
        type: 'Growth',
        risk: 'Medium',
        apy: '12–18%',
        tvl: '$8M',
    },
    {

        name: 'Turbo Vault',
        type: 'Turbo',
        risk: 'High',
        apy: '25–40%',
        tvl: '$3M',
    },
];



const HomeScreen = () => {
    const { provider, address, isConnected } = useWalletConnectModal();

    const [txStatus, setTxStatus] = useState<TxStatus>('IDLE');



    const [wrongNetwork, setWrongNetwork] = useState(false)

    useEffect(() => {
        if (!isConnected || !provider) return;

        const verifyNetwork = async () => {
            const isCorrect = await checkNetwork(provider);
            if (!isCorrect) {
                setWrongNetwork(true);
            } else {
                setWrongNetwork(false);
            }
        };

        verifyNetwork();
    }, [isConnected, provider]);

    const handleSwitchNetwork = async () => {
        try {
            await switchNetwork(provider);
            setWrongNetwork(false);
        } catch {
            setWrongNetwork(true);
        }
    };
    const handleDeposit = async () => {
        if (wrongNetwork) {
            Alert.alert(
                'Wrong Network',
                'Please switch to HyperEVM before depositing'
            );
            return;
        }

       

        const { signer } = await getProviderAndSigner(provider);
        if (!provider || !address) {
            Alert.alert('Data Missing', `Provider or address is missing`)
            return
        }

        console.log("Signer", signer)
        console.log("provider", provider)

        await approveAndDeposit({
            provider,
            signer,
            userAddress: address,
            amount: '100', // from input later
            onStatus: setTxStatus,
        });
    };
    const truncateAddress = (addr?: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };



    return (
        <View style={{ flex: 1, justifyContent: 'space-between', marginVertical: 30, paddingHorizontal: 16 }}>
            <View style={{ padding: 16 }}>
                {isConnected && address ? (
                    <View>
                        <Text style={{ fontWeight: '600' }}>Connected Wallet</Text>
                        <Text>{truncateAddress(address)}</Text>
                    </View>
                ) : (
                    <Text>Wallet not connected</Text>
                )}
            </View>

            <FlatList data={vaults}
                keyExtractor={(item) => item.type}
                renderItem={({ item }) => (
                    <VaultCard {...item} onPress={handleDeposit} />
                )} />

            {wrongNetwork && (
                <View>
                    <Text>Wrong Network. Please switch to HyperEVM.</Text>
                    <Button title="Switch Network" onPress={handleSwitchNetwork} />
                </View>
            )}

            <View style={{ padding: 10, borderRadius: 10, borderWidth: 2, borderColor: 'red', marginHorizontal: 10, marginTop: 10 }}>

                <Button
                    title="Deposit USDC"
                    onPress={handleDeposit}
                    disabled={!isConnected || txStatus === 'APPROVING' || txStatus === 'DEPOSITING'}
                />
                <Text>Tx Status: {txStatus}</Text>
            </View>

        </View>
    )
}

export default HomeScreen