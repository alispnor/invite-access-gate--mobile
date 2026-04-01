import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { InicioStackParamList } from '../../../navigation/types';
import { PlaceholderScreen } from '../_shared/PlaceholderScreen';

type Props = NativeStackScreenProps<InicioStackParamList, 'NucEdit'>;

export function InstalacaoNucEditScreen({ route }: Props) {
  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.INSTALACAO_NUC_EDIT}>
      <PlaceholderScreen
        title={`Editar instalação NUC #${route.params.id}`}
        subtitle="PUT /instalacao-nuc/:id — em construção."
      />
    </ProtectedScreen>
  );
}
