import { View, Text, TextInput, Pressable, Dimensions } from 'react-native';
import { useState, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import Confetti from 'react-confetti'
import { styles } from '../utils/styles';
import { theme } from '../utils/theme';
import { approveAndDeposit, TxStatus } from '../web3/approveDeposit';
import { getProviderAndSigner } from '../web3/provider';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const {height,width} = Dimensions.get('screen')

export default function DepositScreen() {
  const { provider, address, isConnected } = useWalletConnectModal();

  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState<TxStatus>('IDLE');
  const [showConfetti, setShowConfetti] = useState(false);

  const balance = 1000; // mock for now

  const estimatedShares = useMemo(
    () => (amount ? amount : '0'),
    [amount]
  );

  const setPercent = (p: number) => {
    setAmount(((balance * p) / 100).toFixed(2));
  };

  const handleDeposit = async () => {
    if (!provider || !address || !isConnected) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { signer } = await getProviderAndSigner(provider);

      await approveAndDeposit({
        provider,
        signer,
        userAddress: address,
        amount,
        onStatus: setTxStatus,
      });

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    } catch {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
    }
  };

  const loading =
    txStatus === 'APPROVING' || txStatus === 'DEPOSITING';

  return (
    <View style={{ padding: theme.spacing.m }}>
      <View style={styles.card}>
        <Text style={styles.name}>Deposit USDC</Text>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.m,
            padding: theme.spacing.s,
            marginBottom: theme.spacing.m,
          }}
        />

        {/* Quick buttons */}
        <View style={styles.row}>
          {[25, 50, 75, 100].map((p) => (
            <Pressable
              key={p}
              onPress={() => setPercent(p)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 6,
                backgroundColor: theme.colors?.surfaceAlt || 'black',
              }}
            >
              <Text style={styles.value}>
                {p === 100 ? 'MAX' : `${p}%`}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Estimated Shares</Text>
          <Text style={styles.value}>{estimatedShares}</Text>
        </View>

        <Pressable
          onPress={handleDeposit}
         disabled={Boolean(loading) || amount.length === 0}
          style={{
            marginTop: theme.spacing.m,
            backgroundColor: loading
              ? theme.colors.border
              : theme.colors.primary,
            padding: theme.spacing.s,
            borderRadius: theme.borderRadius.m,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {txStatus === 'APPROVING'
              ? 'Approving…'
              : txStatus === 'DEPOSITING'
              ? 'Depositing…'
              : 'Approve & Deposit'}
          </Text>
        </Pressable>

        {txStatus === 'FAILED' && (
          <Text style={{ color: theme.colors.error, marginTop: 8 }}>
            Transaction failed
          </Text>
        )}

        {txStatus === 'REJECTED' && (
          <Text style={{ color: theme.colors.warning, marginTop: 8 }}>
            Transaction cancelled
          </Text>
        )}
      </View>

      {showConfetti && (
        <Confetti
          height={height}
          width={width}
        />
      )}
    </View>
  );
}
