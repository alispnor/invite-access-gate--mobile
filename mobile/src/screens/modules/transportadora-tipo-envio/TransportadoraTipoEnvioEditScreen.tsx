import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConfigStackParamList } from '../../../navigation/types';
import { PlaceholderScreen } from '../_shared/PlaceholderScreen';

type Props = NativeStackScreenProps<
  ConfigStackParamList,
  'TransportadoraTipoEnvioEdit'
>;

export function TransportadoraTipoEnvioEditScreen(_props: Props) {
  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.TRANSPORTADORA_TIPO_ENVIO_EDIT}>
      <PlaceholderScreen
        title="Editar tipos de envio"
        subtitle="Formulário alinhado à rota web transportadora-tipo-envio/edit — em construção."
      />
    </ProtectedScreen>
  );
}
