import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  MoreVertical, 
  Search, 
  Plus, 
  Filter, 
  User as UserIcon, 
  Eye, 
  Edit, 
  Trash2, 
  Key, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock,
  Mail,
  Phone,
  Building2,
  Clock
} from 'lucide-react';
import { User, UserRole } from '../types';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PlatformUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setUsers([]);
      setTenants([]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Form states
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    role: 'tenant_owner',
    status: 'active',
    tenantId: ''
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    
    // Format: "2026-03-10 14:30" -> "10/03/2026 14:30"
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    
    if (timePart) {
      return `${day}/${month}/${year} ${timePart}`;
    }
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativo</Badge>;
      case 'inactive': return <Badge variant="secondary">Inativo</Badge>;
      case 'blocked': return <Badge variant="destructive">Bloqueado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return <Badge className="bg-purple-600">Super Admin</Badge>;
      case 'platform_admin': return <Badge className="bg-indigo-600">Admin Plataforma</Badge>;
      case 'tenant_owner': return <Badge variant="outline">Dono Tenant</Badge>;
      case 'tenant_admin': return <Badge variant="outline">Admin Tenant</Badge>;
      case 'tenant_attendant': return <Badge variant="outline">Atendente</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleCreateUser = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone,
      role: formData.role as UserRole,
      status: formData.status as any || 'active',
      tenantId: formData.tenantId,
      lastAccess: undefined,
      scope: (formData.role === 'super_admin' || formData.role === 'platform_admin') ? 'platform' : 'tenant'
    };

    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'tenant_owner',
      status: 'active',
      tenantId: ''
    });
    toast.success('Usuário criado com sucesso!');
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    setIsEditModalOpen(false);
    setSelectedUser(null);
    toast.success('Usuário atualizado com sucesso!');
  };

  const handleUpdateStatus = (id: string, newStatus: User['status']) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    toast.success(`Status atualizado para ${newStatus}`);
  };

  const handleResetPassword = (email: string) => {
    toast.success(`E-mail de redefinição de senha enviado para ${email}`);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      tenantId: user.tenantId
    });
    setIsEditModalOpen(true);
  };

  const openDetailsDrawer = (user: User) => {
    setSelectedUser(user);
    setIsDetailsDrawerOpen(true);
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      role: user.role,
    });
    setIsRoleModalOpen(true);
  };

  const handleUpdateRole = () => {
    if (!selectedUser) return;

    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: formData.role as UserRole } : u));
    setIsRoleModalOpen(false);
    setSelectedUser(null);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== id));
      toast.success('Usuário excluído com sucesso');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários da Plataforma</h1>
          <p className="text-muted-foreground">Gerencie todos os usuários globais e de tenants.</p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome ou email..." 
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">
                          {user.tenantId 
                            ? tenants.find(t => t.id === user.tenantId)?.name || `Tenant ID: ${user.tenantId}` 
                            : 'Plataforma'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{formatDate(user.lastAccess)}</span>
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
                              <DropdownMenuItem className="gap-2" onClick={() => openDetailsDrawer(user)}>
                                <Eye className="h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => openEditModal(user)}>
                                <Edit className="h-4 w-4" />
                                Editar Usuário
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuGroup>
                              {user.status !== 'active' && (
                                <DropdownMenuItem className="gap-2 text-emerald-600" onClick={() => handleUpdateStatus(user.id, 'active')}>
                                  <CheckCircle className="h-4 w-4" />
                                  Ativar
                                </DropdownMenuItem>
                              )}
                              {user.status === 'active' && (
                                <DropdownMenuItem className="gap-2 text-amber-600" onClick={() => handleUpdateStatus(user.id, 'inactive')}>
                                  <XCircle className="h-4 w-4" />
                                  Desativar
                                </DropdownMenuItem>
                              )}
                              {user.status !== 'blocked' && (
                                <DropdownMenuItem className="gap-2 text-slate-600" onClick={() => handleUpdateStatus(user.id, 'blocked')}>
                                  <Lock className="h-4 w-4" />
                                  Bloquear
                                </DropdownMenuItem>
                              )}
                              {user.status === 'blocked' && (
                                <DropdownMenuItem className="gap-2 text-emerald-600" onClick={() => handleUpdateStatus(user.id, 'active')}>
                                  <Unlock className="h-4 w-4" />
                                  Desbloquear
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuGroup>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuGroup>
                              <DropdownMenuItem className="gap-2" onClick={() => handleResetPassword(user.email)}>
                                <Key className="h-4 w-4" />
                                Redefinir Senha
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => openRoleModal(user)}>
                                <Shield className="h-4 w-4" />
                                Alterar Role
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuGroup>
                              <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4" />
                                Excluir Usuário
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Cadastre um novo usuário na plataforma ou em um tenant.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: João Silva" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="joao@email.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  placeholder="(11) 99999-9999" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role / Perfil</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="platform_admin">Admin Plataforma</SelectItem>
                    <SelectItem value="tenant_owner">Dono de Tenant</SelectItem>
                    <SelectItem value="tenant_admin">Admin de Tenant</SelectItem>
                    <SelectItem value="tenant_attendant">Atendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenant">Tenant Vinculado</Label>
                <Select 
                  value={formData.tenantId} 
                  onValueChange={(v) => setFormData({ ...formData, tenantId: v })}
                >
                  <SelectTrigger id="tenant">
                    <SelectValue placeholder="Plataforma (Global)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Plataforma (Global)</SelectItem>
                    {tenants.map(tenant => (
                      <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
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
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateUser} className="bg-indigo-600 hover:bg-indigo-700">Criar Usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input 
                  id="edit-name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">E-mail</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input 
                  id="edit-phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role / Perfil</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="platform_admin">Admin Plataforma</SelectItem>
                    <SelectItem value="tenant_owner">Dono de Tenant</SelectItem>
                    <SelectItem value="tenant_admin">Admin de Tenant</SelectItem>
                    <SelectItem value="tenant_attendant">Atendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tenant">Tenant Vinculado</Label>
                <Select 
                  value={formData.tenantId} 
                  onValueChange={(v) => setFormData({ ...formData, tenantId: v })}
                >
                  <SelectTrigger id="edit-tenant">
                    <SelectValue placeholder="Plataforma (Global)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Plataforma (Global)</SelectItem>
                    {tenants.map(tenant => (
                      <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
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
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="blocked">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateUser} className="bg-indigo-600 hover:bg-indigo-700">Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Alterar Perfil (Role)</DialogTitle>
            <DialogDescription>
              Mude o nível de acesso para <strong>{selectedUser?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="role-select">Novo Perfil</Label>
              <Select 
                value={formData.role} 
                onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}
              >
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="platform_admin">Admin Plataforma</SelectItem>
                  <SelectItem value="tenant_owner">Dono de Tenant</SelectItem>
                  <SelectItem value="tenant_admin">Admin de Tenant</SelectItem>
                  <SelectItem value="tenant_attendant">Atendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateRole} className="bg-indigo-600 hover:bg-indigo-700">Confirmar Alteração</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Drawer */}
      <Sheet open={isDetailsDrawerOpen} onOpenChange={setIsDetailsDrawerOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="pb-6 border-b">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedUser?.avatar} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg">
                  {selectedUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-2xl">{selectedUser?.name}</SheetTitle>
                <SheetDescription>{selectedUser?.email}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="py-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                <div>{selectedUser && getStatusBadge(selectedUser.status)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perfil</p>
                <div>{selectedUser && getRoleBadge(selectedUser.role)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Último Acesso</p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {selectedUser && formatDate(selectedUser.lastAccess)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tenant</p>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {selectedUser?.tenantId 
                    ? tenants.find(t => t.id === selectedUser.tenantId)?.name 
                    : 'Plataforma'}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold">Informações de Contato</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedUser?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedUser?.phone || 'Não informado'}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold">Histórico Recente</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 text-xs p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />
                    <div>
                      <p className="font-medium">Login realizado com sucesso</p>
                      <p className="text-muted-foreground">10/03/2026 às 14:30 - IP: 192.168.1.1</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => selectedUser && handleResetPassword(selectedUser.email)}
              >
                <Key className="h-4 w-4 mr-2" />
                Redefinir Senha
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => selectedUser && openEditModal(selectedUser)}>
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
