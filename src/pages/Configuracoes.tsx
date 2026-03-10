
import React from 'react';
import { 
  Building2, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Bell, 
  ShieldCheck, 
  CreditCard,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTenant } from '@/contexts/TenantContext';

export default function ConfiguracoesPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!currentTenantId) return;
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setSettings(null);
      setLoading(false);
    };
    fetchData();
  }, [currentTenantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Configurações não encontradas para este tenant.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie os dados de <strong>{settings.companyName}</strong> e preferências do sistema.</p>
      </div>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="empresa" className="gap-2"><Building2 className="h-4 w-4" /> Empresa</TabsTrigger>
          <TabsTrigger value="operacional" className="gap-2"><Clock className="h-4 w-4" /> Operacional</TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2"><Bell className="h-4 w-4" /> Notificações</TabsTrigger>
          <TabsTrigger value="integracoes" className="gap-2"><Globe className="h-4 w-4" /> Integrações</TabsTrigger>
          <TabsTrigger value="financeiro" className="gap-2"><CreditCard className="h-4 w-4" /> Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações básicas que aparecem nos agendamentos e mensagens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-muted rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground group hover:border-primary/50 cursor-pointer transition-colors overflow-hidden">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span className="text-[10px] font-bold uppercase">Logo</span>
                      </>
                    )}
                  </div>
                  <Button variant="outline" size="sm">Alterar Logo</Button>
                </div>

                <div className="flex-1 grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Empresa</Label>
                      <Input defaultValue={settings.companyName} />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail Comercial</Label>
                      <Input defaultValue={settings.email} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input defaultValue={settings.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select defaultValue={settings.preferences.timezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</SelectItem>
                          <SelectItem value="America/Manaus">America/Manaus (GMT-4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" /> Endereço
                  </h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Endereço Completo</Label>
                      <Input defaultValue={settings.address} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button size="lg" className="px-8">Salvar Alterações</Button>
          </div>
        </TabsContent>

        <TabsContent value="operacional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Agendamento</CardTitle>
              <CardDescription>Defina como seus clientes podem agendar horários.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Antecedência Mínima</Label>
                      <p className="text-xs text-muted-foreground">Tempo mínimo antes do horário para agendar.</p>
                    </div>
                    <Select defaultValue="2h">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hora</SelectItem>
                        <SelectItem value="2h">2 horas</SelectItem>
                        <SelectItem value="24h">24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cancelamento Grátis</Label>
                      <p className="text-xs text-muted-foreground">Tempo limite para cancelar sem taxas.</p>
                    </div>
                    <Select defaultValue="24h">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2h">2 horas</SelectItem>
                        <SelectItem value="12h">12 horas</SelectItem>
                        <SelectItem value="24h">24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Agendamento via WhatsApp</Label>
                      <p className="text-xs text-muted-foreground">Permitir que o bot n8n crie agendamentos.</p>
                    </div>
                    <Switch defaultChecked={settings.whatsappConfig.autoReply} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Exibir Preços no Chat</Label>
                      <p className="text-xs text-muted-foreground">Mostrar valores dos serviços durante a triagem.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Label>Política de Cancelamento (Texto)</Label>
                <textarea 
                  className="w-full min-h-[100px] p-3 rounded-lg border bg-background text-sm"
                  defaultValue={settings.cancellationPolicy}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolution API</CardTitle>
              <CardDescription>Configurações técnicas da integração com WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Instância</Label>
                  <Input value={settings.whatsappConfig.instanceName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>URL da Instância</Label>
                  <Input value={`https://api.evolution.com/v1/instance/${settings.whatsappConfig.instanceName}`} readOnly />
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                <ShieldCheck className="h-4 w-4" />
                Estes dados são gerados automaticamente e usados pelo n8n para comunicação.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
