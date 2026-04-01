import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { CadastroStackParamList } from '../../../navigation/types';
import { PlaceholderScreen } from '../_shared/PlaceholderScreen';

type Props = NativeStackScreenProps<CadastroStackParamList, 'VeiculoImport'>;

export function VeiculoImportScreen(_props: Props) {
  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.VEHICLE_IMPORT}>
      <PlaceholderScreen
        title="Importar veículos"
        subtitle="Importação XLS — em construção (rota web importar)."
      />
    </ProtectedScreen>
  );
}
