import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { selection } from '../../../utils/haptics';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import type { CadastroStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';

type Props = NativeStackScreenProps<CadastroStackParamList, 'CadastroMenu'>;

export function CadastroMenuScreen({ navigation }: Props) {
  return (
    <ProtectedScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Gerencie pessoas e veículos</Text>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => { void selection(); navigation.navigate('PessoaList'); }}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#3498db18' }]}>
            <Ionicons name="people" size={28} color="#3498db" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>Pessoas</Text>
            <Text style={styles.cardSub}>Cadastrar, editar e importar</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => { void selection(); navigation.navigate('VeiculoList'); }}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#e67e2218' }]}>
            <Ionicons name="car-sport" size={28} color="#e67e22" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>Veículos</Text>
            <Text style={styles.cardSub}>Cadastrar, editar e importar</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
        </Pressable>
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
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18,
    backgroundColor: colors.bgSecondary, borderRadius: 14, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  iconCircle: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  cardSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
