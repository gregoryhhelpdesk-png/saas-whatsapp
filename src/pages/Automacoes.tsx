
import React, { useState } from 'react';
import { 
  Zap, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Bell,
  CreditCard,
  Calendar,
  Settings2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useTenant } from '@/contexts/TenantContext';

export default function AutomacoesPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [loading, setLoading] = useState(true);
  const [automations, setAutomations] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setAutomations([]);
      setLoading(false);
    };

    if (currentTenantId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentTenantId]);

  const getIcon = (trigger: string) => {
    switch (trigger) {
      case '24h_before': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'immediate': return <Zap className="h-5 w-5 text-amber-500" />;
      case 'payment_pending': return <CreditCard className="h-5 w-5 text-rose-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Automações</h2>
          <p className="text-muted-foreground">Configure as regras de mensagens automáticas via WhatsApp.</p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-blue-900">Operado via n8n</p>
            <p className="text-blue-700">Fluxos inteligentes externos ativos.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-card rounded-xl border shadow-sm">
                <Settings2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Configuração Centralizada</h3>
                <p className="text-sm text-muted-foreground">
                  As mensagens são disparadas pelo n8n, mas você define os textos e regras aqui.
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              Ver Status dos Fluxos <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {automations.map((automation) => (
            <Card key={automation.id} className="group hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-lg">
                    {getIcon(automation.triggerTime)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{automation.name}</CardTitle>
                    <CardDescription className="text-xs">{automation.description}</CardDescription>
                  </div>
                </div>
                <Switch checked={automation.enabled} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg border text-xs font-mono text-muted-foreground italic">
                  "{automation.template}"
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-normal">
                      {automation.triggerTime === '24h_before' ? '24h antes' : 'Imediato'}
                    </Badge>
                    <span className="text-muted-foreground">Canal: WhatsApp</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Editar Template</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Additional Automation Placeholders */}
          <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center opacity-60">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">Nova Automação</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Crie novas regras de disparo para seus clientes.
            </p>
            <Button variant="outline" size="sm" className="mt-4">Adicionar Regra</Button>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Políticas de Mensagens</CardTitle>
          <CardDescription>Diretrizes para evitar bloqueios no WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <p><strong>Intervalos Aleatórios:</strong> O n8n aplica pequenos atrasos entre mensagens para simular comportamento humano.</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <p><strong>Variáveis Dinâmicas:</strong> Use <code>{"{{nome}}"}</code> e <code>{"{{hora}}"}</code> para personalizar cada mensagem.</p>
          </div>
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
            <p><strong>Horário de Silêncio:</strong> Mensagens de marketing não são enviadas entre 21h e 08h.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
