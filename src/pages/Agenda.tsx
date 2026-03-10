
import React, { useState } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  MoreVertical, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenant } from '@/contexts/TenantContext';

export default function AgendaPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [view, setView] = useState<'day' | 'week' | 'list'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // Simulação de busca de dados reais futuramente via services
  React.useEffect(() => {
    if (currentTenantId) {
      setAppointments([]);
      setClients([]);
      setProfessionals([]);
      setServices([]);
    }
  }, [currentTenantId]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 0 }), i));
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Confirmado</Badge>;
      case 'pending': return <Badge variant="secondary">Pendente</Badge>;
      case 'canceled': return <Badge variant="destructive">Cancelado</Badge>;
      case 'completed': return <Badge className="bg-blue-500 hover:bg-blue-600">Concluído</Badge>;
      case 'no_show': return <Badge variant="outline">Falta</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agenda</h2>
          <p className="text-muted-foreground">Gerencie os horários e atendimentos.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(view === 'week' ? subWeeks(currentDate, 1) : addDays(currentDate, -1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 font-semibold">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {view === 'week' 
                  ? `${format(weekDays[0], "dd MMM", { locale: ptBR })} - ${format(weekDays[6], "dd MMM", { locale: ptBR })}`
                  : format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })
                }
              </div>
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(view === 'week' ? addWeeks(currentDate, 1) : addDays(currentDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
            </div>

            <div className="flex items-center gap-2">
              <Tabs value={view} onValueChange={(v: any) => setView(v)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === 'day' && (
        <div className="grid grid-cols-1 gap-4">
          {timeSlots.map((slot) => {
            const slotAppointments = appointments.filter(a => a.startTime.startsWith(slot.split(':')[0]));
            return (
              <div key={slot} className="flex gap-4 group">
                <div className="w-16 text-right text-sm text-muted-foreground font-medium pt-2">
                  {slot}
                </div>
                <div className="flex-1 min-h-[80px] border-t border-dashed relative group-hover:bg-accent/30 transition-colors rounded-lg p-2">
                  {slotAppointments.map((app) => {
                    const client = clients.find(c => c.id === app.clientId);
                    const service = services.find(s => s.id === app.serviceId);
                    return (
                      <div 
                        key={app.id} 
                        className={cn(
                          "absolute inset-x-2 top-2 bottom-2 rounded-lg border-l-4 p-3 shadow-sm flex flex-col justify-between",
                          app.status === 'confirmed' ? "bg-emerald-50 border-emerald-500" : "bg-amber-50 border-amber-500"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold text-foreground">{client?.name}</p>
                            <p className="text-xs text-muted-foreground">{service?.name} • {app.startTime} - {app.endTime}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}>
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Concluir</DropdownMenuItem>
                              <DropdownMenuItem><XCircle className="mr-2 h-4 w-4 text-rose-500" /> Cancelar</DropdownMenuItem>
                              <DropdownMenuItem><AlertCircle className="mr-2 h-4 w-4 text-amber-500" /> Marcar Falta</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(app.status)}
                          <Badge variant="outline" className="text-[10px] uppercase">{app.origin}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {appointments.map((app) => {
                const client = clients.find(c => c.id === app.clientId);
                const service = services.find(s => s.id === app.serviceId);
                const professional = professionals.find(p => p.id === app.professionalId);
                return (
                  <div key={app.id} className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {client?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{client?.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {app.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {app.startTime}</span>
                          <span className="flex items-center gap-1"><Scissors className="h-3 w-3" /> {service?.name}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {professional?.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(app.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Reagendar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Appointment Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Profissional</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione o profissional" /></SelectTrigger>
                  <SelectContent>
                    {professionals.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione o serviço" /></SelectTrigger>
                <SelectContent>
                  {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - R$ {s.price}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Início</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>Fim</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Input placeholder="Opcional..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsAddModalOpen(false)}>Salvar Agendamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
