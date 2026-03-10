import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Check, X, Info } from 'lucide-react';
import { Plan } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function PlatformPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setPlans([]);
      setLoading(false);
    };
    fetchData();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Plan>>({
    name: '',
    price: 0,
    status: 'active',
    limits: {
      users: 0,
      instances: 0,
      messages: 0
    },
    features: {
      inbox: false,
      automations: false,
      reports: false,
      api: false
    }
  });

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({ ...plan });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        price: 0,
        status: 'active',
        limits: {
          users: 5,
          instances: 1,
          messages: 1000
        },
        features: {
          inbox: true,
          automations: false,
          reports: false,
          api: false
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error("O nome do plano é obrigatório");
      return;
    }

    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...formData } as Plan : p));
      toast.success("Plano atualizado com sucesso!");
    } else {
      const newPlan: Plan = {
        ...formData,
        id: `plan-${Date.now()}`,
      } as Plan;
      setPlans([...plans, newPlan]);
      toast.success("Plano criado com sucesso!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este plano?")) {
      setPlans(plans.filter(p => p.id !== id));
      toast.success("Plano removido com sucesso!");
    }
  };

  const toggleStatus = (plan: Plan) => {
    const newStatus = plan.status === 'active' ? 'inactive' : 'active';
    setPlans(plans.map(p => p.id === plan.id ? { ...p, status: newStatus } : p));
    toast.success(`Plano ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planos da Plataforma</h1>
          <p className="text-muted-foreground">Configure os níveis de assinatura e limites do sistema.</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden border-none shadow-md flex flex-col">
            <div className={`absolute top-0 left-0 w-full h-1 ${plan.status === 'active' ? 'bg-indigo-600' : 'bg-slate-400'}`} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>ID: {plan.id}</CardDescription>
                </div>
                <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                  {plan.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">R$ {plan.price}</span>
                <span className="text-muted-foreground text-sm"> /mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Limites</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>{plan.limits.users} Usuários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>{plan.limits.instances} Instâncias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>{plan.limits.messages.toLocaleString()} Mensagens/mês</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recursos</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {plan.features.inbox ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                    <span className={plan.features.inbox ? "" : "text-muted-foreground line-through"}>Caixa de Entrada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.automations ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                    <span className={plan.features.automations ? "" : "text-muted-foreground line-through"}>Automações</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.reports ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                    <span className={plan.features.reports ? "" : "text-muted-foreground line-through"}>Relatórios Avançados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.api ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                    <span className={plan.features.api ? "" : "text-muted-foreground line-through"}>Acesso via API</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 mt-auto">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => handleOpenModal(plan)}
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  className={`gap-2 ${plan.status === 'active' ? 'text-amber-600' : 'text-emerald-600'}`}
                  onClick={() => toggleStatus(plan)}
                >
                  {plan.status === 'active' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Novo/Editar Plano */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
            <DialogDescription>
              Configure os detalhes, limites e recursos deste plano.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="Ex: Plano Business"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-500" />
                Limites do Plano
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="users">Usuários</Label>
                  <Input
                    id="users"
                    type="number"
                    value={formData.limits?.users}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      limits: { ...formData.limits!, users: Number(e.target.value) } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instances">Instâncias</Label>
                  <Input
                    id="instances"
                    type="number"
                    value={formData.limits?.instances}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      limits: { ...formData.limits!, instances: Number(e.target.value) } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messages">Mensagens</Label>
                  <Input
                    id="messages"
                    type="number"
                    value={formData.limits?.messages}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      limits: { ...formData.limits!, messages: Number(e.target.value) } 
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Recursos Inclusos
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="inbox" className="text-xs">Caixa de Entrada</Label>
                  <Switch
                    id="inbox"
                    checked={formData.features?.inbox}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      features: { ...formData.features!, inbox: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="automations" className="text-xs">Automações</Label>
                  <Switch
                    id="automations"
                    checked={formData.features?.automations}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      features: { ...formData.features!, automations: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="reports" className="text-xs">Relatórios</Label>
                  <Switch
                    id="reports"
                    checked={formData.features?.reports}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      features: { ...formData.features!, reports: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="api" className="text-xs">Acesso API</Label>
                  <Switch
                    id="api"
                    checked={formData.features?.api}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      features: { ...formData.features!, api: checked }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
              {editingPlan ? 'Salvar Alterações' : 'Criar Plano'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
