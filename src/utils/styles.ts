import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
