import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConfigStackParamList } from '../../../navigation/types';
import { PlaceholderScreen } from '../_shared/PlaceholderScreen';

type Props = NativeStackScreenProps<ConfigStackParamList, 'TransportadoraEdit'>;

export function TransportadoraEditScreen({ route }: Props) {
  const cnpj = route.params?.cnpj ?? '—';
  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.TRANSPORTADORA_EDIT}>
      <PlaceholderScreen
        title="Vincular transportadora"
        subtitle={`CNPJ: ${cnpj}. POST /operador-logistico/vincular — em construção.`}
      />
    </ProtectedScreen>
  );
}
