import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export type VaultType = 'Stable' | 'Growth' | 'Turbo';

export interface VaultCardProps {
    name: string;
    type: VaultType;
    apy: string;
    tvl: string;
    balance?: string;
    risk?: string
    onPress?: () => void;
}

const getVaultColor = (type: VaultType) => {
    switch (type) {
        case 'Stable': return theme.colors.stable;
        case 'Growth': return theme.colors.growth;
        case 'Turbo': return theme.colors.turbo;
        default: return theme.colors.primary;
    }
};

export const VaultCard = ({ name, type, risk, apy, tvl, balance, onPress }: VaultCardProps) => {
    const accentColor = getVaultColor(type);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={[styles.badge, { backgroundColor: accentColor + '20' }]}>
                <Text style={[styles.badgeText, { color: accentColor }]}>{type.toUpperCase()}</Text>
            </View>

            <View style={styles.header}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.apy}>{apy} APY</Text>
            </View>

            <View style={styles.divider} />
            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>Risk:</Text>
                    <Text style={styles.value}>{risk}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>TVL</Text>
                    <Text style={styles.value}>{tvl}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.label}>My Balance</Text>
                    <Text style={[styles.value, { color: balance ? theme.colors.text : theme.colors.textSecondary }]}>
                        {balance || '$0.00'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        marginVertical: theme.spacing.s,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: theme.spacing.s,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: theme.spacing.s,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    name: {
        ...theme.typography.subHeader,
    },
    apy: {
        ...theme.typography.subHeader,
        color: theme.colors.success,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.s,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        ...theme.typography.caption,
        marginBottom: 2,
    },
    value: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.text,
    },
});
