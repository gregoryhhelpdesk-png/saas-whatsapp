
import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Download,
  Calendar,
  Edit
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import { 
  SimpleAreaChart, 
  AnalyticsCard 
} from '@/components/analytics/ApexCharts';

const financialData = [
  { date: '01/03', Recebido: 1200, Pendente: 400 },
  { date: '02/03', Recebido: 1500, Pendente: 300 },
  { date: '03/03', Recebido: 1100, Pendente: 600 },
  { date: '04/03', Recebido: 1800, Pendente: 200 },
  { date: '05/03', Recebido: 2200, Pendente: 100 },
  { date: '06/03', Recebido: 2500, Pendente: 50 },
  { date: '07/03', Recebido: 1900, Pendente: 150 },
];

export default function RecebimentosPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setTransactions([]);
      setClients([]);
      setServices([]);
      setLoading(false);
    };

    if (currentTenantId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentTenantId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Pago</Badge>;
      case 'pending': return <Badge variant="secondary">Pendente</Badge>;
      case 'overdue': return <Badge variant="destructive">Vencido</Badge>;
      case 'canceled': return <Badge variant="outline">Cancelado</Badge>;
      case 'partial': return <Badge className="bg-blue-500 hover:bg-blue-600">Parcial</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recebimentos</h2>
          <p className="text-muted-foreground">Gestão financeira e controle de pagamentos.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <DollarSign className="h-4 w-4" />
            Registrar Recebimento
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="outline" className="text-[10px]">Mês Atual</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Previsto</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">R$ 8.450,00</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10">65%</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Recebido</p>
            <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400 tracking-tight">R$ 5.492,50</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <Badge variant="outline" className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-900/10">25%</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Pendente</p>
            <h3 className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400 tracking-tight">R$ 2.112,50</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <Badge variant="outline" className="text-[10px] text-rose-600 bg-rose-50 dark:bg-rose-900/10">10%</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Vencido</p>
            <h3 className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400 tracking-tight">R$ 845,00</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <AnalyticsCard
          title="Tendência de Recebimentos"
          subtitle="Comparativo entre valores recebidos e pendentes nos últimos 7 dias."
        >
          <SimpleAreaChart
            data={financialData}
            index="date"
            categories={["Recebido", "Pendente"]}
            colors={["#10b981", "#f59e0b"]}
            valueFormatter={(number: number) => 
              Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(number)
            }
          />
        </AnalyticsCard>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar por cliente ou referência..." className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Período
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Forma</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => {
                const client = clients.find(c => c.id === tx.clientId);
                const service = services.find(s => s.id === tx.serviceId);
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center text-[10px] font-bold">
                          {client?.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{client?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {service?.name}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      R$ {tx.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {tx.dueDate}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(tx.status)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs">
                      {tx.paymentMethod || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Registrar Pagamento</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar Cobrança</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><XCircle className="mr-2 h-4 w-4" /> Cancelar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
