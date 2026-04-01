import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { InicioStackParamList } from '../../../navigation/types';
import { PlaceholderScreen } from '../_shared/PlaceholderScreen';

type Props = NativeStackScreenProps<InicioStackParamList, 'NucCreate'>;

export function InstalacaoNucCreateScreen(_props: Props) {
  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.INSTALACAO_NUC_CREATE}>
      <PlaceholderScreen
        title="Nova instalação NUC"
        subtitle="POST /instalacao-nuc — em construção."
      />
    </ProtectedScreen>
  );
}
