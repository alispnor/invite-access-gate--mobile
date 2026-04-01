import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConfigStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { PlaceholderScreen } from '../_shared/PlaceholderScreen';

type Props = NativeStackScreenProps<
  ConfigStackParamList,
  'TransportadoraTipoEnvioList'
>;

export function TransportadoraTipoEnvioListScreen({ navigation }: Props) {
  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.TRANSPORTADORA_TIPO_ENVIO_LIST}>
      <View style={styles.wrap}>
        <PlaceholderScreen
          title="Tipos de envio (transportadora)"
          subtitle="Lista e edição usam EnvioConfigService no Angular — em construção."
        />
        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate('TransportadoraTipoEnvioEdit')}
        >
          <Text style={styles.btnLabel}>Abrir edição</Text>
        </Pressable>
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bgPrimary },
  btn: {
    margin: 16,
    padding: 14,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnLabel: { color: colors.gateYellow, fontWeight: '600' },
});
