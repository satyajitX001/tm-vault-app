import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { theme } from '../utils/theme';
import * as Haptics from 'expo-haptics';
import { approveAndDeposit, withdrawFunds, TxStatus } from '../web3/vaultActions';
import { ethers } from 'ethers';
// import LottieView from 'lottie-react-native';

interface DepositModalProps {
    visible: boolean;
    onClose: () => void;
    vaultName: string;
    userBalance: string; // Wallet Balance (USDC)
    vaultBalance?: string; // Deposited Balance (Shares/USDC)
    provider: any; // WC provider
    address: string;
}

type Tab = 'DEPOSIT' | 'WITHDRAW';

export const DepositModal = ({
    visible,
    onClose,
    vaultName,
    userBalance,
    vaultBalance = '0.00', // Default if not passed
    provider,
    address
}: DepositModalProps) => {
    const [activeTab, setActiveTab] = useState<Tab>('DEPOSIT');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState<TxStatus>('IDLE');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (visible) {
            setAmount('');
            setStatus('IDLE');
            setErrorMsg('');
        }
    }, [visible]);

    const handlePercentage = (percent: number) => {
        // Mocking vault balance if not provided for demo
        const effectiveVaultBalance = vaultBalance === '0.00' ? '50.00' : vaultBalance;

        const targetBalance = activeTab === 'DEPOSIT' ? userBalance : effectiveVaultBalance;
        if (!targetBalance) return;

        const balanceNum = parseFloat(targetBalance);
        if (isNaN(balanceNum)) return;

        const newAmount = (balanceNum * percent).toFixed(2);
        setAmount(newAmount);
        Haptics.selectionAsync();
    };

    const handleAction = async () => {
        if (!amount || parseFloat(amount) <= 0) return;

        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setErrorMsg('');
            setStatus(activeTab === 'DEPOSIT' ? 'CHECKING' : 'WITHDRAWING');

            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();

            const updateStatus = (newStatus: TxStatus) => {
                console.log('Status update:', newStatus);
                setStatus(newStatus);
                if (['APPROVING', 'DEPOSITING', 'WITHDRAWING'].includes(newStatus)) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                if (newStatus === 'SUCCESS') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
            };

            if (activeTab === 'DEPOSIT') {
                await approveAndDeposit({
                    provider: ethersProvider,
                    signer,
                    userAddress: address,
                    amount,
                    onStatus: updateStatus
                });
            } else {
                await withdrawFunds({
                    signer,
                    amount,
                    onStatus: updateStatus
                });
            }

        } catch (err: any) {
            console.error(err);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setErrorMsg(err.message || 'Transaction failed');
            setStatus('FAILED');
        }
    };

    const isProcessing = ['CHECKING', 'APPROVING', 'DEPOSITING', 'WITHDRAWING'].includes(status);

    const renderTabs = () => (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'DEPOSIT' && styles.activeTab]}
                onPress={() => setActiveTab('DEPOSIT')}
                disabled={isProcessing}
            >
                <Text style={[styles.tabText, activeTab === 'DEPOSIT' && styles.activeTabText]}>
                    Deposit
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'WITHDRAW' && styles.activeTab]}
                onPress={() => setActiveTab('WITHDRAW')}
                disabled={isProcessing}
            >
                <Text style={[styles.tabText, activeTab === 'WITHDRAW' && styles.activeTabText]}>
                    Withdraw
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Render Success State
    if (status === 'SUCCESS') {
        return (
            <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <View style={styles.successContent}>
                            {/* Uncomment if you have assets/confetti.json */}
                            {/* <LottieView
                                source={require('../../assets/confetti.json')}
                                autoPlay
                                loop={false}
                                style={{ width: 200, height: 200, position: 'absolute', top: -50 }}
                            /> */}
                            <Text style={styles.emoji}>🎉</Text>
                            <Text style={styles.successTitle}>
                                {activeTab === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} Successful!
                            </Text>
                            <Text style={styles.successText}>
                                {activeTab === 'DEPOSIT'
                                    ? `You have successfully deposited ${amount} USDC into ${vaultName}.`
                                    : `You have successfully withdrawn ${amount} USDC from ${vaultName}. Funds may be pending unlock.`
                                }
                            </Text>

                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.btnText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{vaultName}</Text>
                        <TouchableOpacity onPress={onClose} disabled={isProcessing}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {renderTabs()}

                    {/* Balance */}
                    <Text style={styles.balance}>
                        {activeTab === 'DEPOSIT' ? 'Available Wallet' : 'Available Vault (Mock)'}: {
                            activeTab === 'DEPOSIT' ? userBalance : (vaultBalance === '0.00' ? '50.00' : vaultBalance)
                        } USDC
                    </Text>

                    {/* Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            editable={!isProcessing}
                        />
                        <Text style={styles.suffix}>USDC</Text>
                    </View>

                    {/* Quick Percentages */}
                    <View style={styles.percentRow}>
                        {[0.25, 0.50, 0.75, 1].map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={styles.percentBtn}
                                onPress={() => handlePercentage(p)}
                                disabled={isProcessing}
                            >
                                <Text style={styles.percentText}>{p === 1 ? 'MAX' : `${p * 100}%`}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Info Rows */}
                    {activeTab === 'DEPOSIT' && amount ? (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Est. Shares:</Text>
                            <Text style={styles.infoValue}>{(parseFloat(amount) * 0.98).toFixed(2)} tokens</Text>
                        </View>
                    ) : null}

                    {activeTab === 'WITHDRAW' && (
                        <View style={[styles.infoRow, { backgroundColor: 'rgba(255,193,7,0.1)' }]}>
                            <Text style={[styles.infoLabel, { color: theme.colors.turbo }]}>Wait Time:</Text>
                            <Text style={[styles.infoValue, { color: theme.colors.turbo }]}>~5 mins (Pending)</Text>
                        </View>
                    )}

                    {/* Status / Error */}
                    {status === 'FAILED' && <Text style={styles.error}>{errorMsg || 'Transaction Failed'}</Text>}
                    {status === 'REJECTED' && <Text style={styles.error}>User Rejected Request</Text>}

                    {/* Action Button */}
                    <TouchableOpacity
                        style={[styles.actionBtn, isProcessing && styles.disabledBtn]}
                        onPress={handleAction}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
                                <Text style={styles.btnText}>
                                    {status === 'CHECKING' ? 'Checking...' :
                                        status === 'APPROVING' ? 'Approving...' :
                                            status === 'DEPOSITING' ? 'Depositing...' :
                                                status === 'WITHDRAWING' ? 'Withdrawing...' : 'Processing...'}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.btnText}>
                                {activeTab === 'DEPOSIT' ? 'Approve & Deposit' : 'Request Withdraw'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: theme.spacing.l,
        minHeight: 500,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    title: {
        ...theme.typography.header,
        fontSize: 20,
    },
    closeText: {
        color: theme.colors.textSecondary,
        fontSize: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.m,
        padding: 4,
        marginBottom: theme.spacing.m,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: theme.colors.surfaceHighlight,
    },
    tabText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.text,
    },
    balance: {
        ...theme.typography.caption,
        marginBottom: theme.spacing.s,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.m,
        paddingHorizontal: theme.spacing.m,
        height: 60,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: '600',
    },
    suffix: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    percentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.l,
    },
    percentBtn: {
        backgroundColor: theme.colors.surfaceHighlight,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: '22%',
        alignItems: 'center',
    },
    percentText: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.m,
        padding: theme.spacing.m,
        backgroundColor: theme.colors.surfaceHighlight,
        borderRadius: theme.borderRadius.s,
    },
    infoLabel: {
        color: theme.colors.textSecondary,
    },
    infoValue: {
        color: theme.colors.text,
        fontWeight: '600',
    },
    actionBtn: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    disabledBtn: {
        backgroundColor: theme.colors.surfaceHighlight,
        opacity: 0.7,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    error: {
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
    },
    successContent: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    successTitle: {
        ...theme.typography.header,
        color: theme.colors.success,
        marginBottom: 10,
    },
    successText: {
        ...theme.typography.body,
        textAlign: 'center',
        marginBottom: 30,
    },
    closeButton: {
        backgroundColor: theme.colors.surfaceHighlight,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 20,
    },
});
