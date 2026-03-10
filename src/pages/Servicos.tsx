
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Scissors,
  Trash2,
  Edit,
  Clock,
  DollarSign,
  CheckCircle2,
  Info
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTenant } from '@/contexts/TenantContext';
import { Service } from '@/types';
import { cn } from '@/lib/utils';

export default function ServicosPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [requiresDeposit, setRequiresDeposit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setServices([]);
      setLoading(false);
    };

    if (currentTenantId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentTenantId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Serviços</h2>
          <p className="text-muted-foreground">Gerencie seu catálogo de serviços e preços.</p>
        </div>
        <Button className="gap-2" onClick={() => {
          setSelectedService(null);
          setRequiresDeposit(false);
          setIsAddModalOpen(true);
        }}>
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Pesquisar serviço..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Sinal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{service.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {service.duration} min
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      R$ {service.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {service.requiresDeposit ? (
                        <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100">
                          R$ {service.depositAmount?.toFixed(2)}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Não exige</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                        {service.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedService(service);
                            setRequiresDeposit(service.requiresDeposit);
                            setIsAddModalOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Service Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedService ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
            <CardDescription>Defina os detalhes do serviço oferecido.</CardDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Serviço</Label>
              <Input defaultValue={selectedService?.name} placeholder="Ex: Corte de Cabelo" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input defaultValue={selectedService?.description} placeholder="Breve descrição do serviço..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duração (minutos)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" className="pl-9" defaultValue={selectedService?.duration || 30} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" className="pl-9" defaultValue={selectedService?.price || 0} />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Exigir Sinal (Pagamento Antecipado)</Label>
                  <p className="text-xs text-muted-foreground">O cliente deve pagar um valor para confirmar.</p>
                </div>
                <Switch 
                  checked={requiresDeposit} 
                  onCheckedChange={setRequiresDeposit} 
                />
              </div>

              {requiresDeposit && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <Label>Valor do Sinal (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="number" className="pl-9" defaultValue={selectedService?.depositAmount || 0} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsAddModalOpen(false)}>Salvar Serviço</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
