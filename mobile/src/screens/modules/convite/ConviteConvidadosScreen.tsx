import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiGet } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { Avatar, Badge, EmptyState, SkeletonListItem } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConviteStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { extractListRows, extractListTotal } from '../../../utils/listResponse';

type Props = NativeStackScreenProps<ConviteStackParamList, 'ConviteConvidados'>;
type Row = Record<string, unknown>;

const guestStatusVariant = (s: string) => {
  const u = s.toUpperCase();
  if (u === 'AUTORIZADO' || u === 'CONFIRMADO' || u === 'ACEITO') return 'success' as const;
  if (u === 'PENDENTE' || u === 'ENVIADO') return 'warning' as const;
  if (u === 'CANCELADO' || u === 'EXCLUIDO' || u === 'ERRO' || u === 'RECUSADO') return 'danger' as const;
  return 'neutral' as const;
};

export function ConviteConvidadosScreen({ route }: Props) {
  const conviteId = route.params.id;
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
      const res = await apiGet<unknown>(`/convidado/${conviteId}`, { current: p, limit });
      const next = extractListRows<Row>(res);
      setTotal(extractListTotal(res));
      setPage(p);
      setRows(append ? (prev) => [...prev, ...next] : next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar');
      if (!append) setRows([]);
    } finally { setLoading(false); setRefreshing(false); }
  }, [conviteId]);

  React.useEffect(() => { void load(1, false); }, [load]);

  const nome = (item: Row) => {
    const p = item.Pessoa as Record<string, unknown> | undefined;
    return String(p?.nome ?? item.nome ?? '—');
  };

  const cpf = (item: Row) => {
    const p = item.Pessoa as Record<string, unknown> | undefined;
    return typeof (p?.cpf ?? item.cpf) === 'string' ? String(p?.cpf ?? item.cpf) : undefined;
  };

  const placa = (item: Row) => {
    const v = item.Veiculo as Record<string, unknown> | undefined;
    return typeof v?.placa === 'string' ? v.placa : undefined;
  };

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.GERENCIAR_CONVITES}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="mail" size={20} color={colors.gateYellow} />
          <Text style={styles.headerText}>Convite #{conviteId}</Text>
          <Badge label={`${total} convidado(s)`} variant="info" />
        </View>

        {loading && rows.length === 0 ? (
          <View>{Array.from({ length: 6 }).map((_, i) => <SkeletonListItem key={i} />)}</View>
        ) : error && rows.length === 0 ? (
          <EmptyState icon="cloud-offline-outline" title="Erro" subtitle={error} />
        ) : rows.length === 0 ? (
          <EmptyState icon="people-outline" title="Nenhum convidado" subtitle="Este convite ainda não tem convidados." />
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item, i) => item.id != null ? `g-${String(item.id)}` : `g-${i}`}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(1, false); }} />}
            renderItem={({ item }) => {
              const status = typeof item.status === 'string' ? item.status : '';
              return (
                <View style={styles.row}>
                  <Avatar name={nome(item)} size={44} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle} numberOfLines={1}>{nome(item)}</Text>
                    <View style={styles.meta}>
                      {status ? <Badge label={status} variant={guestStatusVariant(status)} /> : null}
                      {cpf(item) ? <Text style={styles.rowSub}>{cpf(item)}</Text> : null}
                      {placa(item) ? <Text style={styles.rowSub}>{placa(item)}</Text> : null}
                    </View>
                  </View>
                </View>
              );
            }}
            onEndReached={() => { if (rows.length < total) void load(page + 1, true); }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={<View style={styles.footer}><Text style={styles.footerText}>{rows.length} de {total}</Text></View>}
          />
        )}
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.primary },
  headerText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textLight },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.bgSecondary, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  rowSub: { fontSize: 12, color: colors.textSecondary },
  footer: { padding: 16, alignItems: 'center' },
  footerText: { fontSize: 13, color: colors.textSecondary },
});
