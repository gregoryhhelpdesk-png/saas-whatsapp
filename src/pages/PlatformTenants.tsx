import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle2,
  Smartphone,
  Users,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Star,
  StarOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { Tenant } from '../types';
import { toast } from 'sonner';

interface PlatformTenantsProps {
  setActivePage: (page: string) => void;
}

export default function PlatformTenants({ setActivePage }: PlatformTenantsProps) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const { setScope } = useAuth();
  const { setActiveTenant } = useTenant();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setTenants([]);
      setPlans([]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAccessTenant = (tenant: Tenant) => {
    setActiveTenant(tenant.id, tenant.name);
    setScope('tenant');
    setActivePage('dashboard');
    toast.success(`Acessando tenant: ${tenant.name}`);
  };

  // Form states
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: '',
    slug: '',
    email: '',
    phone: '',
    planId: 'basic',
    status: 'active',
    expiresAt: '',
    isTrusted: false
  });

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativo</Badge>;
      case 'suspended': return <Badge variant="destructive">Suspenso</Badge>;
      case 'trial': return <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">Trial</Badge>;
      case 'overdue': return <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600">Atrasado</Badge>;
      case 'canceled': return <Badge variant="outline">Cancelado</Badge>;
      case 'blocked': return <Badge variant="destructive" className="bg-slate-700 hover:bg-slate-800">Bloqueado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateTenant = () => {
    const newTenant: Tenant = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      slug: formData.slug || '',
      email: formData.email,
      phone: formData.phone,
      planId: formData.planId || 'basic',
      status: (formData.status as any) || 'active',
      trial: formData.status === 'trial',
      expiresAt: formData.expiresAt || '2026-12-31',
      whatsappConnected: false,
      totalUsers: 1,
      isTrusted: formData.isTrusted,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTenants([newTenant, ...tenants]);
    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      slug: '',
      email: '',
      phone: '',
      planId: 'basic',
      status: 'active',
      expiresAt: '',
      isTrusted: false
    });
    toast.success('Tenant criado com sucesso!');
  };

  const handleUpdateTenant = () => {
    if (!selectedTenant) return;

    setTenants(tenants.map(t => t.id === selectedTenant.id ? { ...t, ...formData } : t));
    setIsEditModalOpen(false);
    setSelectedTenant(null);
    toast.success('Tenant atualizado com sucesso!');
  };

  const handleUpdateStatus = (id: string, newStatus: Tenant['status']) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, status: newStatus } : t));
    toast.success(`Status atualizado para ${newStatus}`);
  };

  const handleToggleTrusted = (id: string) => {
    setTenants(tenants.map(t => {
      if (t.id === id) {
        const newState = !t.isTrusted;
        toast.success(newState ? 'Tenant marcado como confiança' : 'Confiança removida');
        return { ...t, isTrusted: newState };
      }
      return t;
    }));
  };

  const handleDeleteTenant = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tenant? Esta ação é irreversível.')) {
      setTenants(tenants.filter(t => t.id !== id));
      toast.success('Tenant excluído com sucesso');
    }
  };

  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      slug: tenant.slug,
      email: tenant.email,
      phone: tenant.phone,
      planId: tenant.planId,
      status: tenant.status,
      expiresAt: tenant.expiresAt,
      isTrusted: tenant.isTrusted
    });
    setIsEditModalOpen(true);
  };

  const openDetailsDrawer = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDetailsDrawerOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Tenants</h1>
          <p className="text-muted-foreground">Administre todas as empresas e instâncias da plataforma.</p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Novo Tenant
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome ou slug..." 
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
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center relative">
                            <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            {tenant.isTrusted && (
                              <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-0.5 border-2 border-background">
                                <Star className="h-2 w-2 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-medium">{tenant.name}</p>
                              {tenant.isTrusted && <Badge variant="outline" className="text-[8px] h-3 px-1 border-amber-200 bg-amber-50 text-amber-700">Confiança</Badge>}
                            </div>
                            <p className="text-[10px] text-muted-foreground">{tenant.slug}.saashed.com</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{tenant.planId}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tenant.whatsappConnected ? 'bg-emerald-500' : 'bg-muted'}`} />
                          <span className="text-xs">{tenant.whatsappConnected ? 'Conectado' : 'Desconectado'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {tenant.totalUsers}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(tenant.expiresAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem className="gap-2" onClick={() => openDetailsDrawer(tenant)}>
                                <Eye className="h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => openEditModal(tenant)}>
                                <Edit className="h-4 w-4" />
                                Editar Tenant
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuGroup>
                              <DropdownMenuItem 
                                className="gap-2 text-indigo-600 dark:text-indigo-400 font-medium"
                                onClick={() => handleAccessTenant(tenant)}
                              >
                                <ExternalLink className="h-4 w-4" />
                                Acessar Tenant
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuGroup>
                              {tenant.status !== 'active' && (
                                <DropdownMenuItem className="gap-2 text-emerald-600" onClick={() => handleUpdateStatus(tenant.id, 'active')}>
                                  <CheckCircle className="h-4 w-4" />
                                  Ativar
                                </DropdownMenuItem>
                              )}
                              {tenant.status === 'active' && (
                                <DropdownMenuItem className="gap-2 text-amber-600" onClick={() => handleUpdateStatus(tenant.id, 'suspended')}>
                                  <XCircle className="h-4 w-4" />
                                  Desativar
                                </DropdownMenuItem>
                              )}
                              {tenant.status !== 'blocked' && (
                                <DropdownMenuItem className="gap-2 text-slate-600" onClick={() => handleUpdateStatus(tenant.id, 'blocked')}>
                                  <Lock className="h-4 w-4" />
                                  Bloquear
                                </DropdownMenuItem>
                              )}
                              {tenant.status === 'blocked' && (
                                <DropdownMenuItem className="gap-2 text-emerald-600" onClick={() => handleUpdateStatus(tenant.id, 'active')}>
                                  <Unlock className="h-4 w-4" />
                                  Desbloquear
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuGroup>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuGroup>
                              <DropdownMenuItem className="gap-2" onClick={() => handleToggleTrusted(tenant.id)}>
                                {tenant.isTrusted ? (
                                  <>
                                    <StarOff className="h-4 w-4 text-amber-500" />
                                    Remover Confiança
                                  </>
                                ) : (
                                  <>
                                    <Star className="h-4 w-4 text-amber-500" />
                                    Marcar como Confiança
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuGroup>
                              <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteTenant(tenant.id)}>
                                <Trash2 className="h-4 w-4" />
                                Excluir Tenant
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum tenant encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Tenant Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Tenant</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova instância na plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Barbearia Elite" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input 
                  id="slug" 
                  placeholder="ex: barbearia-elite" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Contato</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="contato@empresa.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  placeholder="(11) 99999-9999" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Plano</Label>
                <Select 
                  value={formData.planId} 
                  onValueChange={(v) => setFormData({ ...formData, planId: v })}
                >
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status Inicial</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Data de Vencimento</Label>
                <Input 
                  id="expiresAt" 
                  type="date" 
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch 
                  id="isTrusted" 
                  checked={formData.isTrusted}
                  onCheckedChange={(v) => setFormData({ ...formData, isTrusted: v })}
                />
                <Label htmlFor="isTrusted">Tenant Confiável</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateTenant} className="bg-indigo-600 hover:bg-indigo-700">Criar Tenant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tenant Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Tenant</DialogTitle>
            <DialogDescription>
              Atualize as informações do tenant selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome da Empresa</Label>
                <Input 
                  id="edit-name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug (URL)</Label>
                <Input 
                  id="edit-slug" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">E-mail de Contato</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input 
                  id="edit-phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plano</Label>
                <Select 
                  value={formData.planId} 
                  onValueChange={(v) => setFormData({ ...formData, planId: v })}
                >
                  <SelectTrigger id="edit-plan">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                    <SelectItem value="overdue">Atrasado</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                    <SelectItem value="blocked">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-expiresAt">Data de Vencimento</Label>
                <Input 
                  id="edit-expiresAt" 
                  type="date" 
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch 
                  id="edit-isTrusted" 
                  checked={formData.isTrusted}
                  onCheckedChange={(v) => setFormData({ ...formData, isTrusted: v })}
                />
                <Label htmlFor="edit-isTrusted">Tenant Confiável</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateTenant} className="bg-indigo-600 hover:bg-indigo-700">Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Drawer */}
      <Sheet open={isDetailsDrawerOpen} onOpenChange={setIsDetailsDrawerOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="pb-6 border-b">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <SheetTitle className="text-2xl">{selectedTenant?.name}</SheetTitle>
                <SheetDescription>{selectedTenant?.slug}.saashed.com</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="py-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                <div>{selectedTenant && getStatusBadge(selectedTenant.status)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Plano Atual</p>
                <p className="text-sm font-semibold capitalize">{selectedTenant?.planId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vencimento</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {selectedTenant && formatDate(selectedTenant.expiresAt)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">WhatsApp</p>
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  {selectedTenant?.whatsappConnected ? 'Conectado' : 'Desconectado'}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold">Informações de Contato</h3>
              <div className="grid gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">E-mail:</span>
                  <span className="font-medium">{selectedTenant?.email || 'Não informado'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-medium">{selectedTenant?.phone || 'Não informado'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data de Cadastro:</span>
                  <span className="font-medium">{selectedTenant && formatDate(selectedTenant.createdAt)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold">Métricas do Tenant</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Usuários</p>
                  <p className="text-lg font-bold">{selectedTenant?.totalUsers}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Mensagens</p>
                  <p className="text-lg font-bold">1.2k</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Agend.</p>
                  <p className="text-lg font-bold">450</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => selectedTenant && handleAccessTenant(selectedTenant)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Acessar Painel
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => selectedTenant && openEditModal(selectedTenant)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Separator() {
  return <div className="h-px bg-border w-full" />;
}
