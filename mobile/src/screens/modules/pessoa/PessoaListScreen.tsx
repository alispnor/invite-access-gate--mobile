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
import { buildFotoUrl } from '../../../utils/fotoUrl';
import { apiPost } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import {
  AppButton,
  Avatar,
  EmptyState,
  SearchBar,
  SkeletonListItem,
} from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { CadastroStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { extractListRows, extractListTotal } from '../../../utils/listResponse';

type Props = NativeStackScreenProps<CadastroStackParamList, 'PessoaList'>;

type Row = Record<string, unknown>;

export function PessoaListScreen({ navigation }: Props) {
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
      const res = await apiPost<unknown>('/pessoas/list', {
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

  const onRefresh = () => {
    setRefreshing(true);
    void load(1, false);
  };

  const getName = (item: Row) => {
    const nome = item.nome ?? item.name;
    return typeof nome === 'string' ? nome : undefined;
  };

  const label = (item: Row) => {
    const nome = getName(item);
    const cpf = item.cpf_mask ?? item.cpf;
    if (nome) return nome;
    if (typeof cpf === 'string') return cpf;
    return `ID ${String(item.id ?? '—')}`;
  };

  const sub = (item: Row) => {
    const parts: string[] = [];
    if (typeof item.cpf_mask === 'string') parts.push(item.cpf_mask);
    else if (typeof item.cpf === 'string') parts.push(item.cpf);
    if (typeof item.celular === 'string') parts.push(item.celular);
    return parts.join(' · ') || undefined;
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => {
      const nome = getName(r);
      const cpf = typeof r.cpf_mask === 'string' ? r.cpf_mask : (typeof r.cpf === 'string' ? r.cpf : '');
      return (
        (nome && nome.toLowerCase().includes(q)) ||
        cpf.includes(q)
      );
    });
  }, [rows, search]);

  const loadMore = () => {
    if (rows.length < total && !loading) {
      void load(page + 1, true);
    }
  };

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.PERSON_LIST}>
      <View style={styles.container}>
        {/* Search + Actions bar */}
        <View style={styles.topBar}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nome ou CPF…"
          />
          <View style={styles.actions}>
            <AppButton
              label="Nova"
              onPress={() => navigation.navigate('PessoaCreate')}
              icon={<Ionicons name="add-circle" size={18} color={colors.primary} />}
              style={styles.actionBtn}
            />
            <AppButton
              label="Importar"
              variant="outline"
              onPress={() => navigation.navigate('PessoaImport')}
              icon={<Ionicons name="cloud-upload-outline" size={18} color={colors.primary} />}
              style={styles.actionBtn}
            />
          </View>
        </View>

        {/* List */}
        {loading && rows.length === 0 ? (
          <View>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </View>
        ) : error && rows.length === 0 ? (
          <EmptyState
            icon="cloud-offline-outline"
            title="Erro ao carregar"
            subtitle={error}
            action={
              <AppButton label="Tentar novamente" variant="secondary" onPress={() => { setLoading(true); void load(1, false); }} />
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={search ? 'search-outline' : 'people-outline'}
            title={search ? 'Nenhum resultado' : 'Nenhuma pessoa cadastrada'}
            subtitle={search ? `Nenhuma pessoa encontrada para "${search}"` : 'Toque em "Nova" para cadastrar.'}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item, i) =>
              item.id != null ? `p-${String(item.id)}` : `p-${i}`
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.row}
                onPress={() => {
                  void selection();
                  const id = item.id;
                  if (id != null) {
                    navigation.navigate('PessoaEdit', { id: String(id) });
                  }
                }}
              >
                <Avatar
                  name={getName(item)}
                  uri={buildFotoUrl(typeof item.foto === 'string' ? item.foto : null)}
                  size={44}
                />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {label(item)}
                  </Text>
                  {sub(item) ? (
                    <Text style={styles.rowSub} numberOfLines={1}>
                      {sub(item)}
                    </Text>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
              </Pressable>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {filtered.length} de {total || rows.length}
                </Text>
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
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    minHeight: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rowSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
