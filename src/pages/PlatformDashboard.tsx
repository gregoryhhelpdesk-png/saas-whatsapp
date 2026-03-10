import React from 'react';
import { 
  Building2, 
  Users, 
  Smartphone, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  SimpleAreaChart, 
  SimpleBarChart, 
  RadialBarChart,
  AnalyticsCard 
} from '@/components/analytics/ApexCharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PlatformDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [platformStats, setPlatformStats] = React.useState<any>({
    totalTenants: 0,
    totalUsers: 0,
    connectedInstances: 0,
    totalWhatsAppInstances: 0,
    mrr: 0
  });
  const [tenants, setTenants] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setPlatformStats({
        totalTenants: 0,
        totalUsers: 0,
        connectedInstances: 0,
        totalWhatsAppInstances: 0,
        mrr: 0
      });
      setTenants([]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { 
      title: 'Total de Tenants', 
      value: platformStats.totalTenants, 
      icon: Building2, 
      trend: '+0%', 
      description: 'Crescimento mensal' 
    },
    { 
      title: 'Usuários Totais', 
      value: platformStats.totalUsers, 
      icon: Users, 
      trend: '+0%', 
      description: 'Em todos os tenants' 
    },
    { 
      title: 'Instâncias WhatsApp', 
      value: `${platformStats.connectedInstances}/${platformStats.totalWhatsAppInstances}`, 
      icon: Smartphone, 
      trend: '0%', 
      description: 'Taxa de conexão' 
    },
    { 
      title: 'MRR Estimado', 
      value: `R$ ${platformStats.mrr.toLocaleString()}`, 
      icon: DollarSign, 
      trend: '+0%', 
      description: 'Receita recorrente' 
    },
  ];

  const growthData = [
    { month: 'Set', Tenants: 85 },
    { month: 'Out', Tenants: 92 },
    { month: 'Nov', Tenants: 105 },
    { month: 'Dez', Tenants: 112 },
    { month: 'Jan', Tenants: 118 },
    { month: 'Fev', Tenants: 124 },
  ];

  const planDistribution = [
    { label: 'Básico', value: 45, color: '#818cf8' },
    { label: 'Premium', value: 65, color: '#6366f1' },
    { label: 'Enterprise', value: 14, color: '#4f46e5' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard da Plataforma</h1>
        <p className="text-muted-foreground">Visão executiva e operacional de todos os tenants.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <stat.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-emerald-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </span>
                <span className="text-[10px] text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <AnalyticsCard
          title="Crescimento de Tenants"
          subtitle="Novos cadastros nos últimos 6 meses."
          className="lg:col-span-4"
        >
          <SimpleAreaChart
            data={growthData}
            index="month"
            categories={['Tenants']}
            colors={['#6366f1']}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Distribuição por Plano"
          subtitle="Proporção de tenants por nível de assinatura."
          className="lg:col-span-3"
        >
          <RadialBarChart
            data={planDistribution}
          />
        </AnalyticsCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Tenants Cadastrados</CardTitle>
            <CardDescription>Empresas que entraram na plataforma recentemente.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenants.slice(0, 4).map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tenant.name}</p>
                      <p className="text-xs text-muted-foreground">{tenant.slug}.saashed.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                      {tenant.planId.toUpperCase()}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">{tenant.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs">Ver todos os tenants</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas e Monitoramento</CardTitle>
            <CardDescription>Eventos críticos que requerem atenção.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Instâncias Desconectadas</p>
                  <p className="text-xs text-muted-foreground">12 instâncias perderam a conexão nos últimos 30 minutos.</p>
                  <Button variant="link" className="h-auto p-0 text-xs text-destructive mt-1">Ver instâncias</Button>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Fila de Webhooks</p>
                  <p className="text-xs text-muted-foreground">O processamento de webhooks está com latência de 1.5s.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Backup Concluído</p>
                  <p className="text-xs text-muted-foreground">O backup global da plataforma foi finalizado com sucesso.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
