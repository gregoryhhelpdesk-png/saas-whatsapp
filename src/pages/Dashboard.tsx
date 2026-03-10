import React from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  Clock,
  MessageSquare,
  Zap,
  Download,
  Plus
} from 'lucide-react';
import { 
  MixedChart, 
  RadialBarChart, 
  AnalyticsCard 
} from '@/components/analytics/ApexCharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SectionLoader } from '@/components/loaders';

const chartData = [
  { name: 'Seg', appointments: 12, revenue: 450 },
  { name: 'Ter', appointments: 19, revenue: 720 },
  { name: 'Qua', appointments: 15, revenue: 600 },
  { name: 'Qui', appointments: 22, revenue: 900 },
  { name: 'Sex', appointments: 30, revenue: 1250 },
  { name: 'Sab', appointments: 35, revenue: 1500 },
  { name: 'Dom', appointments: 5, revenue: 200 },
];

const statusDistribution = [
  { label: 'Confirmados', value: 65, color: '#10b981' }, // emerald-500
  { label: 'Pendentes', value: 20, color: '#f59e0b' },   // amber-500
  { label: 'Cancelados', value: 10, color: '#f43f5e' },   // rose-500
  { label: 'Faltas', value: 5, color: '#64748b' },       // slate-500
];

const StatCard = ({ title, value, icon: Icon, description, trend, trendValue }: any) => (
  <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </CardContent>
  </Card>
);

import { useTenant } from '@/contexts/TenantContext';

export default function DashboardPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [loading, setLoading] = React.useState(true);
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [whatsAppInstances, setWhatsAppInstances] = React.useState<any[]>([]);
  const [clients, setClients] = React.useState<any[]>([]);
  const [services, setServices] = React.useState<any[]>([]);
  const [professionals, setProfessionals] = React.useState<any[]>([]);

  // Calculate stats
  const appointmentsToday = appointments.length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const whatsappStatus = whatsAppInstances[0]?.status === 'connected' ? 'Conectado' : 'Desconectado';
  const whatsappInstanceName = whatsAppInstances[0]?.name || 'Nenhuma';

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setAppointments([]);
      setTransactions([]);
      setWhatsAppInstances([]);
      setClients([]);
      setServices([]);
      setProfessionals([]);
      setLoading(false);
    };

    if (currentTenantId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentTenantId]);

  if (loading) {
    return <SectionLoader className="h-[calc(100vh-200px)]" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral da sua operação hoje.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Agendamentos Hoje" 
          value={appointmentsToday.toString()} 
          icon={Calendar} 
          description={`${appointmentsToday} agendamentos totais`}
          trend="up"
          trendValue="+12%"
        />
        <StatCard 
          title="Faturamento Previsto" 
          value={Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalRevenue)} 
          icon={DollarSign} 
          description={`Baseado em ${transactions.length} transações`}
          trend="up"
          trendValue="+5%"
        />
        <StatCard 
          title="Confirmados" 
          value={confirmedAppointments.toString()} 
          icon={CheckCircle2} 
          description={`${Math.round((confirmedAppointments / (appointmentsToday || 1)) * 100)}% de taxa de confirmação`}
        />
        <StatCard 
          title="WhatsApp Status" 
          value={whatsappStatus} 
          icon={MessageSquare} 
          description={`Instância: ${whatsappInstanceName}`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Main Chart */}
        <AnalyticsCard 
          title="Agendamentos e Faturamento" 
          subtitle="Desempenho semanal: volume de atendimentos vs receita gerada."
          className="md:col-span-4"
        >
          <MixedChart data={chartData} />
        </AnalyticsCard>

        {/* Status Distribution */}
        <AnalyticsCard 
          title="Status dos Agendamentos" 
          subtitle="Distribuição percentual por categoria."
          className="md:col-span-3"
        >
          <RadialBarChart data={statusDistribution} />
        </AnalyticsCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Next Appointments */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Agendamentos para as próximas horas.</CardDescription>
            </div>
            <Button variant="outline" size="sm">Ver Agenda</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {appointments.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg border">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] font-bold">{item.startTime}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {clients.find(c => c.id === item.clientId)?.name || 'Cliente'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {services.find(s => s.id === item.serviceId)?.name || 'Serviço'} • {professionals.find(p => p.id === item.professionalId)?.name || 'Profissional'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.status === 'confirmed' ? 'default' : 'secondary'}>
                    {item.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum agendamento para hoje.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Operational Alerts */}
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Alertas Operacionais</CardTitle>
            <CardDescription>Ações que requerem atenção.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-rose-500">3 Pagamentos Vencidos</p>
                  <p className="text-xs text-muted-foreground">Clientes com débitos pendentes há mais de 2 dias.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-500">WhatsApp Instável</p>
                  <p className="text-xs text-muted-foreground">A conexão com a Evolution API falhou 2 vezes hoje.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Zap className="h-5 w-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-500">Automação Executada</p>
                  <p className="text-xs text-muted-foreground">15 lembretes enviados com sucesso via n8n.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
