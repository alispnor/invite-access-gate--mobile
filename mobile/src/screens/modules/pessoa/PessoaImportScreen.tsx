import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { CadastroStackParamList } from '../../../navigation/types';
import { PlaceholderScreen } from '../_shared/PlaceholderScreen';

type Props = NativeStackScreenProps<CadastroStackParamList, 'PessoaImport'>;

export function PessoaImportScreen(_props: Props) {
  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.PERSON_IMPORT}>
      <PlaceholderScreen
        title="Importar pessoas (XLS)"
        subtitle="Wizard de importação e validação — em construção."
      />
    </ProtectedScreen>
  );
}
