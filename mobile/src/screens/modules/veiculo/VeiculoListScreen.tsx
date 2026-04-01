import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
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
  EmptyState,
  SearchBar,
  SkeletonListItem,
} from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { CadastroStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { extractListRows, extractListTotal } from '../../../utils/listResponse';

type Props = NativeStackScreenProps<CadastroStackParamList, 'VeiculoList'>;
type Row = Record<string, unknown>;

export function VeiculoListScreen({ navigation }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 20;

  const load = useCallback(async (p: number, append: boolean) => {
    setError(null);
    try {
      const res = await apiGet<unknown>('/veiculos', { current: p, limit });
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

  const placa = (item: Row) => String(item.placa ?? item.plate ?? '—');
  const desc = (item: Row) =>
    [item.marca, item.modelo, item.cor].filter(Boolean).join(' · ') || undefined;

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => placa(r).toLowerCase().includes(q) || (desc(r) ?? '').toLowerCase().includes(q));
  }, [rows, search]);

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.VEHICLE_LIST}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar por placa…" />
          <View style={styles.actions}>
            <AppButton
              label="Novo"
              onPress={() => navigation.navigate('VeiculoCreate')}
              icon={<Ionicons name="add-circle" size={18} color={colors.primary} />}
              style={styles.actionBtn}
            />
            <AppButton
              label="Importar"
              variant="outline"
              onPress={() => navigation.navigate('VeiculoImport')}
              icon={<Ionicons name="cloud-upload-outline" size={18} color={colors.primary} />}
              style={styles.actionBtn}
            />
          </View>
        </View>

        {loading && rows.length === 0 ? (
          <View>{Array.from({ length: 8 }).map((_, i) => <SkeletonListItem key={i} />)}</View>
        ) : error && rows.length === 0 ? (
          <EmptyState icon="cloud-offline-outline" title="Erro ao carregar" subtitle={error}
            action={<AppButton label="Tentar novamente" variant="secondary" onPress={() => { setLoading(true); void load(1, false); }} />}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={search ? 'search-outline' : 'car-outline'}
            title={search ? 'Nenhum resultado' : 'Nenhum veículo cadastrado'}
            subtitle={search ? `Nenhum veículo encontrado para "${search}"` : 'Toque em "Novo" para cadastrar.'}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item, i) => item.id != null ? `v-${String(item.id)}` : `v-${i}`}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(1, false); }} />}
            renderItem={({ item }) => (
              <Pressable
                style={styles.row}
                onPress={() => {
                  void selection();
                  if (item.id != null) navigation.navigate('VeiculoEdit', { id: String(item.id) });
                }}
              >
                <View style={styles.plateBox}>
                  <Ionicons name="car-sport" size={20} color={colors.info2} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{placa(item)}</Text>
                  {desc(item) ? <Text style={styles.rowSub}>{desc(item)}</Text> : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
              </Pressable>
            )}
            onEndReached={() => { if (rows.length < total) void load(page + 1, true); }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              <View style={styles.footer}>
                <Text style={styles.footerText}>{filtered.length} de {total || rows.length}</Text>
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
  topBar: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 10, backgroundColor: colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: colors.border },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 10, minHeight: 40 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.bgSecondary, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  plateBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#e3f2fd', alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, letterSpacing: 0.5 },
  rowSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  footer: { padding: 16, alignItems: 'center' },
  footerText: { fontSize: 13, color: colors.textSecondary },
});
