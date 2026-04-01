import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConfigStackParamList } from '../../../navigation/types';
import { PlaceholderScreen } from '../_shared/PlaceholderScreen';

type Props = NativeStackScreenProps<
  ConfigStackParamList,
  'ConfigTipoEnvioConfig'
>;

export function ConfigTipoEnvioScreen(_props: Props) {
  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.ENVIO_CONFIG}>
      <PlaceholderScreen
        title="Configuração de tipos de envio"
        subtitle="POST /configuracao e /configuracao/save (operador master) — em construção."
      />
    </ProtectedScreen>
  );
}
