import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { Button, Text, View } from 'react-native';

export default function ConnectWalletButton() {
    const { open, isConnected, address } = useWalletConnectModal();

    return (
        <View>
            {!isConnected ? (
                <Button title="Connect Wallet" onPress={() => open()} />
            ) : (
                <Text>
                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </Text>
            )}
        </View>
    );
}
