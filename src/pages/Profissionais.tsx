
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar, 
  UserSquare2,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  XCircle
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
import { Checkbox } from '@/components/ui/checkbox';
import { useTenant } from '@/contexts/TenantContext';
import { Professional } from '@/types';
import { cn } from '@/lib/utils';

export default function ProfissionaisPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setProfessionals([]);
      setLoading(false);
    };

    if (currentTenantId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentTenantId]);

  const daysOfWeek = [
    { id: 0, label: 'Dom' },
    { id: 1, label: 'Seg' },
    { id: 2, label: 'Ter' },
    { id: 3, label: 'Qua' },
    { id: 4, label: 'Qui' },
    { id: 5, label: 'Sex' },
    { id: 6, label: 'Sab' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profissionais</h2>
          <p className="text-muted-foreground">Gerencie sua equipe e disponibilidades.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Profissional
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Pesquisar profissional..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead className="hidden md:table-cell">Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((pro) => (
                  <TableRow key={pro.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {pro.name.charAt(0)}
                        </div>
                        <span className="font-medium">{pro.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">{pro.specialty}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {pro.phone}</span>
                        <span className="flex items-center gap-1 mt-1"><Mail className="h-3 w-3" /> {pro.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pro.status === 'active' ? 'default' : 'secondary'}>
                        {pro.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedProfessional(pro);
                            setIsAddModalOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem><Calendar className="mr-2 h-4 w-4" /> Ver Agenda</DropdownMenuItem>
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

      {/* Add/Edit Professional Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProfessional ? 'Editar Profissional' : 'Novo Profissional'}</DialogTitle>
            <CardDescription>Configure os dados e horários de atendimento.</CardDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input defaultValue={selectedProfessional?.name} placeholder="Ex: Carlos Silva" />
              </div>
              <div className="space-y-2">
                <Label>Especialidade</Label>
                <Input defaultValue={selectedProfessional?.specialty} placeholder="Ex: Barbeiro" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input defaultValue={selectedProfessional?.phone} placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input defaultValue={selectedProfessional?.email} placeholder="carlos@email.com" />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" /> Horários de Atendimento
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Início do Expediente</Label>
                  <Input type="time" defaultValue={selectedProfessional?.availability.start || "09:00"} />
                </div>
                <div className="space-y-2">
                  <Label>Fim do Expediente</Label>
                  <Input type="time" defaultValue={selectedProfessional?.availability.end || "18:00"} />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Dias de Atendimento</Label>
                <div className="flex flex-wrap gap-3">
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2 bg-muted p-2 rounded-lg border">
                      <Checkbox 
                        id={`day-${day.id}`} 
                        defaultChecked={selectedProfessional?.availability.days.includes(day.id) || [1,2,3,4,5].includes(day.id)} 
                      />
                      <label 
                        htmlFor={`day-${day.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Intervalos (Almoço/Pausa)</Label>
                <div className="flex items-center gap-3">
                  <Input type="time" className="w-32" defaultValue="12:00" />
                  <span className="text-muted-foreground">até</span>
                  <Input type="time" className="w-32" defaultValue="13:00" />
                  <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              setSelectedProfessional(null);
            }}>Cancelar</Button>
            <Button onClick={() => {
              setIsAddModalOpen(false);
              setSelectedProfessional(null);
            }}>Salvar Profissional</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
