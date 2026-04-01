import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiGet, apiPost } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { AppButton, Badge } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConfigStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { showError, showSuccess } from '../../../utils/toast';

type Props = NativeStackScreenProps<ConfigStackParamList, 'WhatsappConfig'>;

type WhatsAppStatus = {
  instance_name?: string;
  status?: string;
  state?: string;
  documento_empresa?: string;
  razao_social_empresa?: string;
};

export function WhatsappConfigScreen(_props: Props) {
  const [data, setData] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await apiGet<WhatsAppStatus>('/configuracao/whatsapp');
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
      setData(null);
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  const statusVariant = (s?: string) => {
    if (s === 'CONECTADO' || s === 'open') return 'success' as const;
    if (s === 'CRIADO' || s === 'connecting') return 'warning' as const;
    return 'danger' as const;
  };

  const handleAction = async (action: 'create' | 'restart' | 'logout') => {
    setActionLoading(true);
    try {
      if (action === 'create') await apiPost('/evolution/instance', { qrcode: true });
      else if (action === 'restart') await apiPost('/evolution/restart', {});
      else await apiPost('/evolution/logout', {});
      showSuccess(action === 'create' ? 'Instância criada' : action === 'restart' ? 'Reiniciado' : 'Desconectado');
      void load();
    } catch (e) { showError(e instanceof Error ? e.message : 'Erro'); }
    finally { setActionLoading(false); }
  };

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.WHATSAPP_CONFIG}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} />}
      >
        {loading ? (
          <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
        ) : error ? (
          <View style={styles.center}>
            <Ionicons name="logo-whatsapp" size={48} color={colors.gray300} />
            <Text style={styles.errorText}>{error}</Text>
            <AppButton label="Tentar novamente" variant="secondary" onPress={() => { setLoading(true); void load(); }} />
          </View>
        ) : (
          <>
            {/* Status card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons name="logo-whatsapp" size={32} color="#25d366" />
                <View style={styles.statusText}>
                  <Text style={styles.instanceName}>{data?.instance_name ?? 'Não configurado'}</Text>
                  {data?.razao_social_empresa ? <Text style={styles.company}>{data.razao_social_empresa}</Text> : null}
                </View>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Status:</Text>
                <Badge label={data?.status ?? 'DESCONECTADO'} variant={statusVariant(data?.status)} />
              </View>
              {data?.state ? (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>State:</Text>
                  <Badge label={data.state} variant={statusVariant(data.state)} />
                </View>
              ) : null}
              {data?.documento_empresa ? (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>CNPJ:</Text>
                  <Text style={styles.value}>{data.documento_empresa}</Text>
                </View>
              ) : null}
            </View>

            {/* Actions */}
            <Text style={styles.sectionTitle}>Ações</Text>
            <View style={styles.actions}>
              <AppButton label="Criar instância" variant="secondary" onPress={() => void handleAction('create')} loading={actionLoading} icon={<Ionicons name="add-circle" size={18} color={colors.gateYellow} />} />
              <AppButton label="Reiniciar" variant="outline" onPress={() => void handleAction('restart')} loading={actionLoading} icon={<Ionicons name="refresh" size={18} color={colors.primary} />} />
              <AppButton label="Desconectar" variant="danger" onPress={() => void handleAction('logout')} loading={actionLoading} icon={<Ionicons name="log-out" size={18} color="#fff" />} />
            </View>
          </>
        )}
      </ScrollView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: 20, paddingBottom: 40 },
  center: { alignItems: 'center', gap: 12, paddingTop: 40 },
  errorText: { color: colors.danger, fontSize: 14, textAlign: 'center' },
  statusCard: {
    backgroundColor: colors.bgSecondary, borderRadius: 14, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    gap: 12,
  },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusText: { flex: 1 },
  instanceName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  company: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 14, color: colors.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 24, marginBottom: 12 },
  actions: { gap: 10 },
});
