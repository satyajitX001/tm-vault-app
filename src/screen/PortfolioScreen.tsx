import { View, Text, ScrollView } from 'react-native';
import { styles } from '../utils/styles';
import { theme } from '../utils/theme';

type Position = {
    vault: string;
    risk: 'Low' | 'Medium' | 'High';
    deposited: number;
    shares: number;
    usdValue: number;
};

const positions: Position[] = [
    {
        vault: 'Stable Vault',
        risk: 'Low',
        deposited: 500,
        shares: 500,
        usdValue: 520,
    },
    {
        vault: 'Growth Vault',
        risk: 'Medium',
        deposited: 300,
        shares: 280,
        usdValue: 350,
    },
    {
        vault: 'Turbo Vault',
        risk: 'High',
        deposited: 200,
        shares: 180,
        usdValue: 260,
    },
];

export default function PortfolioScreen() {
    const totalValue = positions.reduce(
        (sum, p) => sum + p.usdValue,
        0
    );

    return (
        <ScrollView style={{ padding: theme.spacing.m }}>
            {/* ===== TOTAL VALUE ===== */}
            <View style={[styles.card, { marginBottom: theme.spacing.m }]}>
                <Text style={styles.label}>Total Portfolio Value</Text>
                <Text
                    style={{
                        ...styles.name,
                        fontSize: 28,
                        marginTop: 4,
                    }}
                >
                    ${totalValue.toFixed(2)}
                </Text>
            </View>

            {/* ===== POSITIONS ===== */}
            {positions.map((pos) => (
                <View key={pos.vault} style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{pos.vault}</Text>
                        <Text
                            style={{
                                ...styles.badgeText,
                                color:
                                    pos.risk === 'Low'
                                        ? theme.colors.success
                                        : pos.risk === 'Medium'
                                            ? theme.colors.warning
                                            : theme.colors.error,
                            }}
                        >
                            {pos.risk}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Deposited</Text>
                        <Text style={styles.value}>
                            {pos.deposited} USDC
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Shares</Text>
                        <Text style={styles.value}>{pos.shares}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Current Value</Text>
                        <Text style={styles.value}>
                            ${pos.usdValue}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}
