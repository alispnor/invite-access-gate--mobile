import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { apiGet } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConfigStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { extractListRows } from '../../../utils/listResponse';
import { listStyles } from '../_shared/listStyles';

type Props = NativeStackScreenProps<ConfigStackParamList, 'TransportadoraList'>;

type Row = Record<string, unknown>;

function normalizeTransportadoras(data: unknown): Row[] {
  if (Array.isArray(data)) return data as Row[];
  return extractListRows<Row>(data);
}

export function TransportadoraListScreen({ navigation }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await apiGet<unknown>('/operador-logistico/transportadora');
      setRows(normalizeTransportadoras(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar');
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const label = (item: Row) =>
    String(item.razao_social ?? item.nome_fantasia ?? item.cnpj ?? '—');

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.TRANSPORTADORA_LIST}>
      <View style={listStyles.container}>
        {loading ? (
          <View style={listStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item, i) =>
              item.cnpj != null ? `t-${String(item.cnpj)}` : `t-${i}`
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  void load();
                }}
              />
            }
            renderItem={({ item }) => (
              <Pressable
                style={listStyles.row}
                onPress={() => {
                  const cnpj = item.cnpj != null ? String(item.cnpj) : undefined;
                  navigation.navigate('TransportadoraEdit', { cnpj });
                }}
              >
                <Text style={listStyles.rowTitle}>{label(item)}</Text>
                {item.cnpj != null ? (
                  <Text style={listStyles.rowSub}>{String(item.cnpj)}</Text>
                ) : null}
              </Pressable>
            )}
            ListFooterComponent={
              error ? (
                <Text style={[listStyles.error, { padding: 16 }]}>{error}</Text>
              ) : null
            }
          />
        )}
      </View>
    </ProtectedScreen>
  );
}
