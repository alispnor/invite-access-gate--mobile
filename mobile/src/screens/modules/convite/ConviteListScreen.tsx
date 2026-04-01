import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { selection } from '../../../utils/haptics';
import { apiGet } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import {
  AppButton,
  Badge,
  EmptyState,
  SkeletonListItem,
} from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConviteStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { extractListRows, extractListTotal } from '../../../utils/listResponse';

type Props = NativeStackScreenProps<ConviteStackParamList, 'ConviteList'>;
type Row = Record<string, unknown>;

const statusVariant = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'PROCESSADO' || s === 'CRIADO') return 'success' as const;
  if (s === 'PENDENTE') return 'warning' as const;
  if (s === 'CANCELADO' || s === 'VENCIDO') return 'danger' as const;
  return 'neutral' as const;
};

export function ConviteListScreen({ navigation }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const load = useCallback(async (p: number, append: boolean) => {
    setError(null);
    try {
      const res = await apiGet<unknown>('/convite', { page: p, current: p, limit, pageSize: limit });
      const next = extractListRows<Row>(res);
      setTotal(extractListTotal(res));
      setPage(p);
      setRows(append ? (prev) => [...prev, ...next] : next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar');
      if (!append) setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => { void load(1, false); }, [load]);

  const conviteId = (item: Row) =>
    item.convite_id ?? item.id ?? (item.Convite as Record<string, unknown> | undefined)?.id;

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.GERENCIAR_CONVITES}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <AppButton
            label="Enviar convite"
            onPress={() => navigation.navigate('ConviteEnviar')}
            icon={<Ionicons name="send" size={18} color={colors.primary} />}
          />
        </View>

        {loading && rows.length === 0 ? (
          <View>{Array.from({ length: 6 }).map((_, i) => <SkeletonListItem key={i} />)}</View>
        ) : error && rows.length === 0 ? (
          <EmptyState icon="cloud-offline-outline" title="Erro ao carregar" subtitle={error}
            action={<AppButton label="Tentar novamente" variant="secondary" onPress={() => { setLoading(true); void load(1, false); }} />}
          />
        ) : rows.length === 0 ? (
          <EmptyState icon="mail-outline" title="Nenhum convite" subtitle='Toque em "Enviar convite" para criar.' />
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item, i) => { const id = conviteId(item); return id != null ? `c-${String(id)}` : `c-${i}`; }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(1, false); }} />}
            renderItem={({ item }) => {
              const id = conviteId(item);
              const status = typeof item.status === 'string' ? item.status : '';
              const tipo = typeof item.tipo === 'string' ? item.tipo : '';
              const totalConvidados = typeof item.total_convidados === 'number' ? item.total_convidados : null;
              return (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    void selection();
                    if (id != null) navigation.navigate('ConviteConvidados', { id: String(id) });
                  }}
                >
                  <View style={styles.rowIcon}>
                    <Ionicons name="mail" size={22} color={colors.gateYellow} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>Convite #{String(id ?? '—')}</Text>
                    <View style={styles.rowMeta}>
                      {status ? <Badge label={status} variant={statusVariant(status)} /> : null}
                      {tipo ? <Text style={styles.rowSub}>{tipo}</Text> : null}
                      {totalConvidados != null ? (
                        <Text style={styles.rowSub}>{totalConvidados} convidado(s)</Text>
                      ) : null}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
                </Pressable>
              );
            }}
            onEndReached={() => { if (rows.length < total) void load(page + 1, true); }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              <View style={styles.footer}>
                <Text style={styles.footerText}>{rows.length} de {total || rows.length}</Text>
              </View>
            }
          />
        )}
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  topBar: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.bgSecondary, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  rowSub: { fontSize: 12, color: colors.textSecondary },
  footer: { padding: 16, alignItems: 'center' },
  footerText: { fontSize: 13, color: colors.textSecondary },
});
