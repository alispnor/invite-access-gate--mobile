import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { apiGet } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { RelatoriosStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { extractListRows, extractListTotal } from '../../../utils/listResponse';
import { listStyles } from '../_shared/listStyles';

type Props = NativeStackScreenProps<RelatoriosStackParamList, 'ListaAutorizacao'>;

type Row = Record<string, unknown>;

export function ListaAutorizacaoScreen(_props: Props) {
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
      const res = await apiGet<unknown>('/lista-autorizacoes', {
        current: p,
        limit,
      });
      const next = extractListRows<Row>(res);
      setTotal(extractListTotal(res));
      setPage(p);
      if (append) {
        setRows((prev) => [...prev, ...next]);
      } else {
        setRows(next);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar');
      if (!append) setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void load(1, false);
  }, [load]);

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.REPORT_HISTORICO}>
      <View style={listStyles.container}>
        {loading && rows.length === 0 ? (
          <View style={listStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item, i) =>
              item.id != null ? `a-${String(item.id)}` : `a-${i}`
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  void load(1, false);
                }}
              />
            }
            renderItem={({ item }) => (
              <View style={listStyles.row}>
                <Text style={listStyles.rowTitle}>
                  {JSON.stringify(item).slice(0, 120)}…
                </Text>
              </View>
            )}
            ListFooterComponent={
              <View style={listStyles.footer}>
                {error ? (
                  <Text style={listStyles.error}>{error}</Text>
                ) : null}
                <Text style={listStyles.footerText}>
                  {rows.length} de {total || rows.length} registos
                </Text>
                {rows.length < total ? (
                  <Text
                    onPress={() => void load(page + 1, true)}
                    style={{ color: colors.info2, marginTop: 8 }}
                  >
                    Carregar mais
                  </Text>
                ) : null}
              </View>
            }
          />
        )}
      </View>
    </ProtectedScreen>
  );
}
