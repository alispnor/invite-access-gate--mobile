import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import { ProtectedScreen } from '../auth/ProtectedScreen';
import { selection, impactMedium } from '../utils/haptics';
import type { InicioStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type NavProp = NativeStackNavigationProp<InicioStackParamList, 'InicioHome'>;

type HubItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  color: string;
  onPress: (nav: NavProp) => void;
};

const hubItems: HubItem[] = [
  {
    label: 'Pontos de Atendimento',
    icon: 'location',
    description: 'Gerenciar PAs',
    color: '#e74c3c',
    onPress: (nav) => nav.navigate('PaList'),
  },
  {
    label: 'Instalação NUC',
    icon: 'server',
    description: 'Dispositivos NUC',
    color: '#2c3e50',
    onPress: (nav) => nav.navigate('NucList'),
  },
  {
    label: 'Termo público',
    icon: 'document-text',
    description: 'Convidado público',
    color: '#8e44ad',
    onPress: (nav) => nav.navigate('TermoPublicHome'),
  },
];

function HomeBody() {
  const { signOut, userProfile } = useAuth();
  const navigation = useNavigation<NavProp>();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const greeting = userProfile?.firstName
    ? `Olá, ${userProfile.firstName}`
    : 'Bem-vindo';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, isWide && styles.contentTablet]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.subtitle}>GUÉP Portaria</Text>

      <Text style={styles.sectionTitle}>Acesso rápido</Text>

      {hubItems.map((item) => (
        <Pressable
          key={item.label}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => { void selection(); item.onPress(navigation); }}
        >
          <View style={[styles.iconCircle, { backgroundColor: item.color + '18' }]}>
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.label}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </Pressable>
      ))}

      <Pressable
        style={styles.signOutBtn}
        onPress={() => {
          void impactMedium();
          void signOut();
        }}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.signOutLabel}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

export function HomeScreen() {
  return (
    <ProtectedScreen>
      <HomeBody />
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: 20, paddingTop: 24, paddingBottom: 40 },
  contentTablet: { maxWidth: 720, alignSelf: 'center', width: '100%' },
  greeting: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 2, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginBottom: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    backgroundColor: colors.bgSecondary, borderRadius: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  iconCircle: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, marginTop: 24,
  },
  signOutLabel: { fontSize: 15, color: colors.danger, fontWeight: '600' },
});
