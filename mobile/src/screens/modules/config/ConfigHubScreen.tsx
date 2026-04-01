import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { selection } from '../../../utils/haptics';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import type { ConfigStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';

type Props = NativeStackScreenProps<ConfigStackParamList, 'ConfigHub'>;

type ConfigItem = {
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

export function ConfigHubScreen({ navigation }: Props) {
  const items: ConfigItem[] = [
    {
      label: 'Tipos de envio',
      subtitle: 'Configuração master de canais',
      icon: 'paper-plane',
      color: '#3498db',
      onPress: () => navigation.navigate('ConfigTipoEnvioConfig'),
    },
    {
      label: 'Transportadoras',
      subtitle: 'Vincular transportadoras',
      icon: 'bus',
      color: '#e67e22',
      onPress: () => navigation.navigate('TransportadoraList'),
    },
    {
      label: 'Tipo envio por transportadora',
      subtitle: 'Canais de envio por empresa',
      icon: 'git-branch',
      color: '#8e44ad',
      onPress: () => navigation.navigate('TransportadoraTipoEnvioList'),
    },
    {
      label: 'WhatsApp',
      subtitle: 'Instância e QR code',
      icon: 'logo-whatsapp',
      color: '#25d366',
      onPress: () => navigation.navigate('WhatsappConfig'),
    },
  ];

  return (
    <ProtectedScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Configuração</Text>
        <Text style={styles.subtitle}>Gerencie as configurações do sistema</Text>

        {items.map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => { void selection(); item.onPress(); }}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardSub}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </Pressable>
        ))}
      </ScrollView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: colors.bgSecondary,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  iconCircle: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  cardSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
