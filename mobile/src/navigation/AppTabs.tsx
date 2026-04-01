import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { CadastroMenuScreen } from '../screens/modules/cadastro/CadastroMenuScreen';
import { ConfigHubScreen } from '../screens/modules/config/ConfigHubScreen';
import { ConfigTipoEnvioScreen } from '../screens/modules/configuracao-tipo-envio/ConfigTipoEnvioScreen';
import { ConviteConvidadosScreen } from '../screens/modules/convite/ConviteConvidadosScreen';
import { ConviteEnviarScreen } from '../screens/modules/convite/ConviteEnviarScreen';
import { ConviteListScreen } from '../screens/modules/convite/ConviteListScreen';
import { InstalacaoNucCreateScreen } from '../screens/modules/instalacao-nuc/InstalacaoNucCreateScreen';
import { InstalacaoNucEditScreen } from '../screens/modules/instalacao-nuc/InstalacaoNucEditScreen';
import { InstalacaoNucListScreen } from '../screens/modules/instalacao-nuc/InstalacaoNucListScreen';
import { ListaAutorizacaoScreen } from '../screens/modules/lista-autorizacao/ListaAutorizacaoScreen';
import { PessoaCreateScreen } from '../screens/modules/pessoa/PessoaCreateScreen';
import { PessoaEditScreen } from '../screens/modules/pessoa/PessoaEditScreen';
import { PessoaImportScreen } from '../screens/modules/pessoa/PessoaImportScreen';
import { PessoaListScreen } from '../screens/modules/pessoa/PessoaListScreen';
import { PontoAtendimentoCreateScreen } from '../screens/modules/ponto-atendimento/PontoAtendimentoCreateScreen';
import { PontoAtendimentoEditScreen } from '../screens/modules/ponto-atendimento/PontoAtendimentoEditScreen';
import { PontoAtendimentoListScreen } from '../screens/modules/ponto-atendimento/PontoAtendimentoListScreen';
import { RelatorioGridScreen } from '../screens/modules/relatorio/RelatorioGridScreen';
import { TermoConvitePublicoScreen } from '../screens/modules/termo-convite-publico/TermoConvitePublicoScreen';
import { TransportadoraEditScreen } from '../screens/modules/transportadora-vincular/TransportadoraEditScreen';
import { TransportadoraListScreen } from '../screens/modules/transportadora-vincular/TransportadoraListScreen';
import { TransportadoraTipoEnvioEditScreen } from '../screens/modules/transportadora-tipo-envio/TransportadoraTipoEnvioEditScreen';
import { TransportadoraTipoEnvioListScreen } from '../screens/modules/transportadora-tipo-envio/TransportadoraTipoEnvioListScreen';
import { VeiculoCreateScreen } from '../screens/modules/veiculo/VeiculoCreateScreen';
import { VeiculoEditScreen } from '../screens/modules/veiculo/VeiculoEditScreen';
import { VeiculoImportScreen } from '../screens/modules/veiculo/VeiculoImportScreen';
import { VeiculoListScreen } from '../screens/modules/veiculo/VeiculoListScreen';
import { WhatsappConfigScreen } from '../screens/modules/whatsapp/WhatsappConfigScreen';
import { colors } from '../theme/colors';
import type {
  CadastroStackParamList,
  ConfigStackParamList,
  ConviteStackParamList,
  InicioStackParamList,
  RelatoriosStackParamList,
  TabParamList,
} from './types';

/* ── shared header options ──────────────────────────────────── */

const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.gateYellow,
  headerTitleStyle: { fontWeight: '600' as const },
};

/* ── stack navigators ───────────────────────────────────────── */

const InicioStack = createNativeStackNavigator<InicioStackParamList>();
function InicioNav() {
  return (
    <InicioStack.Navigator screenOptions={headerOptions}>
      <InicioStack.Screen name="InicioHome" component={HomeScreen} options={{ title: 'Início' }} />
      {/* PA and NUC accessible from Home */}
      <InicioStack.Screen name="PaList" component={PontoAtendimentoListScreen} options={{ title: 'Pontos de atendimento' }} />
      <InicioStack.Screen name="PaCreate" component={PontoAtendimentoCreateScreen} options={{ title: 'Novo PA' }} />
      <InicioStack.Screen name="PaEdit" component={PontoAtendimentoEditScreen} options={{ title: 'Editar PA' }} />
      <InicioStack.Screen name="NucList" component={InstalacaoNucListScreen} options={{ title: 'Instalação NUC' }} />
      <InicioStack.Screen name="NucCreate" component={InstalacaoNucCreateScreen} options={{ title: 'Nova NUC' }} />
      <InicioStack.Screen name="NucEdit" component={InstalacaoNucEditScreen} options={{ title: 'Editar NUC' }} />
      <InicioStack.Screen name="TermoPublicHome" component={TermoConvitePublicoScreen} options={{ title: 'Convidado público' }} />
    </InicioStack.Navigator>
  );
}

const CadastroStack = createNativeStackNavigator<CadastroStackParamList>();
function CadastroNav() {
  return (
    <CadastroStack.Navigator screenOptions={headerOptions}>
      <CadastroStack.Screen name="CadastroMenu" component={CadastroMenuScreen} options={{ title: 'Cadastro' }} />
      <CadastroStack.Screen name="PessoaList" component={PessoaListScreen} options={{ title: 'Pessoas' }} />
      <CadastroStack.Screen name="PessoaCreate" component={PessoaCreateScreen} options={{ title: 'Nova pessoa' }} />
      <CadastroStack.Screen name="PessoaEdit" component={PessoaEditScreen} options={{ title: 'Editar pessoa' }} />
      <CadastroStack.Screen name="PessoaImport" component={PessoaImportScreen} options={{ title: 'Importar pessoas' }} />
      <CadastroStack.Screen name="VeiculoList" component={VeiculoListScreen} options={{ title: 'Veículos' }} />
      <CadastroStack.Screen name="VeiculoCreate" component={VeiculoCreateScreen} options={{ title: 'Novo veículo' }} />
      <CadastroStack.Screen name="VeiculoEdit" component={VeiculoEditScreen} options={{ title: 'Editar veículo' }} />
      <CadastroStack.Screen name="VeiculoImport" component={VeiculoImportScreen} options={{ title: 'Importar veículos' }} />
    </CadastroStack.Navigator>
  );
}

const ConviteStack = createNativeStackNavigator<ConviteStackParamList>();
function ConviteNav() {
  return (
    <ConviteStack.Navigator screenOptions={headerOptions} initialRouteName="ConviteList">
      <ConviteStack.Screen name="ConviteList" component={ConviteListScreen} options={{ title: 'Convites' }} />
      <ConviteStack.Screen name="ConviteEnviar" component={ConviteEnviarScreen} options={{ title: 'Enviar convite' }} />
      <ConviteStack.Screen name="ConviteConvidados" component={ConviteConvidadosScreen} options={{ title: 'Convidados' }} />
    </ConviteStack.Navigator>
  );
}

const RelatoriosStack = createNativeStackNavigator<RelatoriosStackParamList>();
function RelatoriosNav() {
  return (
    <RelatoriosStack.Navigator screenOptions={headerOptions}>
      <RelatoriosStack.Screen
        name="RelatorioGrid"
        component={RelatorioGridScreen}
        options={({ navigation }) => ({
          title: 'Relatório',
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('ListaAutorizacao')} style={{ marginRight: 4 }}>
              <Text style={{ color: colors.gateYellow, fontWeight: '600', fontSize: 14 }}>Autorizações</Text>
            </Pressable>
          ),
        })}
      />
      <RelatoriosStack.Screen name="ListaAutorizacao" component={ListaAutorizacaoScreen} options={{ title: 'Autorizações' }} />
    </RelatoriosStack.Navigator>
  );
}

const ConfigStack = createNativeStackNavigator<ConfigStackParamList>();
function ConfigNav() {
  return (
    <ConfigStack.Navigator screenOptions={headerOptions}>
      <ConfigStack.Screen name="ConfigHub" component={ConfigHubScreen} options={{ title: 'Configuração' }} />
      <ConfigStack.Screen name="ConfigTipoEnvioConfig" component={ConfigTipoEnvioScreen} options={{ title: 'Tipos de envio' }} />
      <ConfigStack.Screen name="TransportadoraList" component={TransportadoraListScreen} options={{ title: 'Transportadoras' }} />
      <ConfigStack.Screen name="TransportadoraEdit" component={TransportadoraEditScreen} options={{ title: 'Vincular' }} />
      <ConfigStack.Screen name="TransportadoraTipoEnvioList" component={TransportadoraTipoEnvioListScreen} options={{ title: 'Tipo envio (transp.)' }} />
      <ConfigStack.Screen name="TransportadoraTipoEnvioEdit" component={TransportadoraTipoEnvioEditScreen} options={{ title: 'Editar tipo envio' }} />
      <ConfigStack.Screen name="WhatsappConfig" component={WhatsappConfigScreen} options={{ title: 'WhatsApp' }} />
    </ConfigStack.Navigator>
  );
}

/* ── bottom tab navigator ───────────────────────────────────── */

const Tab = createBottomTabNavigator<TabParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gateYellow,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.gray800,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="InicioTab"
        component={InicioNav}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CadastroTab"
        component={CadastroNav}
        options={{
          title: 'Cadastro',
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ConviteTab"
        component={ConviteNav}
        options={{
          title: 'Convites',
          tabBarIcon: ({ color, size }) => <Ionicons name="mail" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="RelatoriosTab"
        component={RelatoriosNav}
        options={{
          title: 'Relatórios',
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ConfigTab"
        component={ConfigNav}
        options={{
          title: 'Config',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
