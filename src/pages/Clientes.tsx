
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar, 
  ChevronRight,
  UserPlus,
  FileText,
  Trash2,
  Edit
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { useTenant } from '@/contexts/TenantContext';
import { Client } from '@/types';
import { cn } from '@/lib/utils';
import { TableLoader } from '@/components/loaders';
import { 
  SimpleBarChart, 
  AnalyticsCard 
} from '@/components/analytics/ApexCharts';

const clientGrowthData = [
  { month: 'Out', Novos: 45 },
  { month: 'Nov', Novos: 52 },
  { month: 'Dez', Novos: 48 },
  { month: 'Jan', Novos: 61 },
  { month: 'Fev', Novos: 55 },
  { month: 'Mar', Novos: 67 },
];

export default function ClientesPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setClients([]);
      setLoading(false);
    };

    if (currentTenantId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentTenantId]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">Gerencie sua base de clientes.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <AnalyticsCard
          title="Crescimento da Base de Clientes"
          subtitle="Novos clientes cadastrados nos últimos 6 meses."
        >
          <SimpleBarChart
            data={clientGrowthData}
            index="month"
            categories={["Novos"]}
            colors={["#6366f1"]}
            valueFormatter={(number: number) => number.toString()}
          />
        </AnalyticsCard>
      </div>

      <Card>
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar por nome ou telefone..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">Exportar</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <TableLoader rows={5} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Contato</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Último Atendimento</TableHead>
                  <TableHead className="text-center">Agendamentos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => {
                    setSelectedClient(client);
                    setIsDetailsOpen(true);
                  }}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone}</span>
                        <span className="flex items-center gap-1 mt-1"><Mail className="h-3 w-3" /> {client.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {client.lastService || 'Nenhum'}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {client.totalAppointments}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                          <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Histórico</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Client Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                {selectedClient?.name.charAt(0)}
              </div>
              <div>
                <SheetTitle className="text-2xl">{selectedClient?.name}</SheetTitle>
                <Badge variant={selectedClient?.status === 'active' ? 'default' : 'secondary'}>
                  {selectedClient?.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total de Agendamentos</p>
                <p className="text-xl font-bold">{selectedClient?.totalAppointments}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Último Atendimento</p>
                <p className="text-xl font-bold">{selectedClient?.lastService || '-'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" /> Contato
              </h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Telefone</span>
                  <span>{selectedClient?.phone}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">E-mail</span>
                  <span>{selectedClient?.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Histórico Recente
              </h3>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Corte de Cabelo</p>
                      <p className="text-xs text-muted-foreground">10 Mar 2024 • Carlos</p>
                    </div>
                    <Badge variant="outline">Concluído</Badge>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full text-xs">Ver histórico completo</Button>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Editar Cadastro</Button>
              <Button variant="outline" className="flex-1">Novo Agendamento</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
