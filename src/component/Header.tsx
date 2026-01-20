import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';

interface HeaderProps {
    isConnected: boolean;
    address?: string;
    balance?: string;
    onConnect: () => void;
    onDisconnect: () => void;
}

export const Header = ({ isConnected, address, balance, onConnect, onDisconnect }: HeaderProps) => {

    const formatAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>TM Vaults</Text>
                {isConnected && (
                    <Text style={styles.subtitle}>Balance: {balance || '0.00'} USDC</Text>
                )}
            </View>

            <TouchableOpacity
                style={[styles.button, isConnected ? styles.connectedBtn : styles.connectBtn]}
                onPress={isConnected ? onDisconnect : onConnect}
            >
                <Text style={styles.btnText}>
                    {isConnected ? formatAddress(address!) : 'Connect Wallet'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        paddingTop: 60, // safe area approx
        paddingBottom: theme.spacing.m,
        backgroundColor: theme.colors.background,
    },
    title: {
        ...theme.typography.header,
    },
    subtitle: {
        ...theme.typography.caption,
        marginTop: 4,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    connectBtn: {
        backgroundColor: theme.colors.primary,
    },
    connectedBtn: {
        backgroundColor: theme.colors.surfaceHighlight,
        borderWidth: 1,
        borderColor: theme.colors.success,
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    }
});
