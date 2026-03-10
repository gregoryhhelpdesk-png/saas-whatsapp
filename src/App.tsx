/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Suspense } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/Dashboard';
import AgendaPage from './pages/Agenda';
import ClientesPage from './pages/Clientes';
import ProfissionaisPage from './pages/Profissionais';
import ServicosPage from './pages/Servicos';
import RecebimentosPage from './pages/Recebimentos';
import WhatsAppPage from './pages/WhatsApp';
import InboxPage from './pages/Inbox';
import AutomacoesPage from './pages/Automacoes';
import LogsPage from './pages/Logs';
import ConfiguracoesPage from './pages/Configuracoes';
import AuthPage from './pages/Auth';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TenantProvider, useTenant } from './contexts/TenantContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

// Platform Pages
import PlatformDashboard from './pages/PlatformDashboard';
import PlatformTenants from './pages/PlatformTenants';
import PlatformUsers from './pages/PlatformUsers';
import PlatformPlans from './pages/PlatformPlans';
import PlatformFinance from './pages/PlatformFinance';
import PlatformInstances from './pages/PlatformInstances';
import PlatformIntegrations from './pages/PlatformIntegrations';
import PlatformWebhooks from './pages/PlatformWebhooks';
import PlatformLogs from './pages/PlatformLogs';
import PlatformPlaceholder from './pages/PlatformPlaceholder';
import { 
  CreditCard, 
  ShieldCheck, 
  Activity, 
  Settings 
} from 'lucide-react';

// Simple Error Boundary
class ErrorBoundary extends React.Component<any, any> {
  public state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h1 className="text-2xl font-bold">Ops! Algo deu errado.</h1>
            <p className="text-muted-foreground">
              Ocorreu um erro inesperado na aplicação. Por favor, tente recarregar a página.
            </p>
            <pre className="p-4 bg-muted rounded-lg text-left text-xs overflow-auto max-h-40">
              {this.state.error?.toString()}
            </pre>
            <Button onClick={() => window.location.reload()} className="w-full">
              Recarregar Página
            </Button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

function AppContent() {
  const { user, scope, setScope } = useAuth();
  const { activeTenantId } = useTenant();
  const [activePage, setActivePage] = React.useState('dashboard');

  // Reset active page when scope changes
  React.useEffect(() => {
    if (scope === 'platform') {
      setActivePage('platform-dashboard');
    } else {
      setActivePage('dashboard');
    }
  }, [scope]);

  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    // Platform Routes
    if (scope === 'platform') {
      switch (activePage) {
        case 'platform-dashboard': return <PlatformDashboard />;
        case 'platform-tenants': return <PlatformTenants setActivePage={setActivePage} />;
        case 'platform-users': return <PlatformUsers />;
        case 'platform-plans': return <PlatformPlans />;
        case 'platform-finance': return <PlatformFinance />;
        case 'platform-whatsapp': return <PlatformInstances />;
        case 'platform-integrations': return <PlatformIntegrations />;
        case 'platform-webhooks': return <PlatformWebhooks />;
        case 'platform-logs': return <PlatformLogs />;
        case 'platform-audit': return <PlatformPlaceholder title="Auditoria" description="Rastreabilidade de ações administrativas." icon={ShieldCheck} />;
        case 'platform-monitoring': return <PlatformPlaceholder title="Monitoramento" description="Saúde técnica da infraestrutura." icon={Activity} />;
        case 'platform-settings': return <PlatformPlaceholder title="Configurações" description="Parâmetros globais do sistema." icon={Settings} />;
        default: return <PlatformDashboard />;
      }
    }

    // Tenant Routes
    if (scope === 'tenant' && !activeTenantId) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <ShieldCheck className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold">Nenhum Tenant Selecionado</h2>
          <p className="text-muted-foreground max-w-md">
            Como Super Admin, você precisa selecionar um tenant na plataforma para visualizar seu painel.
          </p>
          <Button onClick={() => {
            setScope('platform');
            setActivePage('platform-tenants');
          }}>
            Ir para Gestão de Tenants
          </Button>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'inbox': return <InboxPage />;
      case 'agenda': return <AgendaPage />;
      case 'clientes': return <ClientesPage />;
      case 'profissionais': return <ProfissionaisPage />;
      case 'servicos': return <ServicosPage />;
      case 'recebimentos': return <RecebimentosPage />;
      case 'whatsapp': return <WhatsAppPage />;
      case 'automacoes': return <AutomacoesPage />;
      case 'logs': return <LogsPage />;
      case 'configuracoes': return <ConfiguracoesPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      <Suspense fallback={<div className="flex items-center justify-center h-full">Carregando...</div>}>
        {renderPage()}
      </Suspense>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="saashed-theme">
      <TooltipProvider>
        <ErrorBoundary>
          <AuthProvider>
            <TenantProvider>
              <AppContent />
              <Toaster />
            </TenantProvider>
          </AuthProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  );
}
