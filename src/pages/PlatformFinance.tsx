import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  Settings2, 
  ShieldCheck,
  Bell,
  Ban,
  Clock,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Mail,
  Smartphone
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function PlatformFinance() {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [billingLogs, setBillingLogs] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setSubscriptions([]);
      setInvoices([]);
      setBillingLogs([]);
      setRules([]);
      setTenants([]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getTenantName = (id: string) => tenants.find(t => t.id === id)?.name || 'Desconhecido';
  const getTenantSlug = (id: string) => tenants.find(t => t.id === id)?.slug || '';

  const totalMRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + s.amount, 0);

  const overdueCount = subscriptions.filter(s => s.status === 'overdue').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-500">Ativo</Badge>;
      case 'overdue': return <Badge variant="destructive" className="bg-amber-500">Atrasado</Badge>;
      case 'suspended': return <Badge variant="destructive">Suspenso</Badge>;
      case 'trial': return <Badge variant="secondary" className="bg-blue-500 text-white">Trial</Badge>;
      case 'canceled': return <Badge variant="outline">Cancelado</Badge>;
      case 'paid': return <Badge className="bg-emerald-500">Pago</Badge>;
      case 'pending': return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pendente</Badge>;
      case 'failed': return <Badge variant="destructive">Falhou</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro Global</h1>
          <p className="text-muted-foreground">Controle de assinaturas, faturamento e regras de cobrança.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Relatório Anual
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">Nova Cobrança Manual</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">0% da base total</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">R$ 1.240 em faturas atrasadas</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate (30d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-500 rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2%</div>
            <p className="text-xs text-muted-foreground">-0.4% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="subscriptions" className="gap-2">
              <Users className="h-4 w-4" />
              Assinaturas
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Faturas
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <Clock className="h-4 w-4" />
              Logs de Cobrança
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Regras
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar tenant..." 
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ciclo</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getTenantName(sub.tenantId)}</p>
                          <p className="text-[10px] text-muted-foreground">{getTenantSlug(sub.tenantId)}.saashed.com</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{sub.planId}</Badge>
                      </TableCell>
                      <TableCell>R$ {sub.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="capitalize">{sub.cycle === 'monthly' ? 'Mensal' : 'Anual'}</TableCell>
                      <TableCell>{new Date(sub.nextBilling).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Settings2 className="h-4 w-4" />
                              Alterar Plano
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Ban className="h-4 w-4" />
                              Cancelar Assinatura
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Mês Ref.</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-[10px]">{inv.id}</TableCell>
                      <TableCell className="font-medium">{getTenantName(inv.tenantId)}</TableCell>
                      <TableCell>{inv.referenceMonth}</TableCell>
                      <TableCell>R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(inv.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-[10px] font-mono text-muted-foreground">{log.sentAt}</TableCell>
                      <TableCell className="font-medium">{getTenantName(log.tenantId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.actionType === 'reminder' ? <Bell className="h-3 w-3 text-blue-500" /> : <AlertCircle className="h-3 w-3 text-rose-500" />}
                          <span className="text-xs">
                            {log.actionType === 'reminder' ? 'Lembrete' : 
                             log.actionType === 'overdue_notice' ? 'Aviso de Atraso' : 
                             log.actionType === 'block_notice' ? 'Aviso de Bloqueio' : 'Bloqueio Efetuado'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.channel === 'whatsapp' ? <Smartphone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                          <span className="text-xs capitalize">{log.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {log.status === 'success' ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-rose-500" />}
                          <span className="text-xs">{log.status === 'success' ? 'Sucesso' : 'Falha'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground max-w-xs truncate">{log.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {rules.map((rule) => (
              <Card key={rule.id} className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-indigo-500" />
                      {rule.name}
                    </CardTitle>
                    <Badge className={rule.active ? 'bg-emerald-500' : 'bg-slate-500'}>
                      {rule.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <CardDescription>Configurações automáticas de cobrança e bloqueio.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Lembrete Antes</p>
                      <p className="text-lg font-bold">{rule.reminderBeforeDays} dias</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Bloqueio Após</p>
                      <p className="text-lg font-bold text-amber-600">{rule.blockAfterDays} dias</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Suspensão Após</p>
                      <p className="text-lg font-bold text-rose-600">{rule.suspendAfterDays} dias</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Exceção Confiança</p>
                      <p className="text-lg font-bold">{rule.trustExceptionEnabled ? 'Ativa' : 'Inativa'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground">Ações Automáticas</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>Enviar lembrete via WhatsApp e E-mail</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>Bloquear acesso ao painel após {rule.blockAfterDays} dias de atraso</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>Respeitar tenants marcados como "Confiança"</span>
                      </li>
                    </ul>
                  </div>

                  <Button className="w-full variant-outline">Editar Regras</Button>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center opacity-60">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Settings2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Nova Regra de Cobrança</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Crie regras personalizadas para diferentes grupos de tenants.
              </p>
              <Button variant="outline" size="sm" className="mt-4">Criar Regra</Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
