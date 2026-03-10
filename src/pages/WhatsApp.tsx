
import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  RefreshCw, 
  Unlink, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  QrCode,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import { QrCodeLoader } from '@/components/loaders';

import { 
  SimpleBarChart, 
  AnalyticsCard 
} from '@/components/analytics/ApexCharts';

const messageData = [
  { date: '01/03', Enviadas: 120, Recebidas: 80 },
  { date: '02/03', Enviadas: 150, Recebidas: 95 },
  { date: '03/03', Enviadas: 110, Recebidas: 110 },
  { date: '04/03', Enviadas: 180, Recebidas: 140 },
  { date: '05/03', Enviadas: 220, Recebidas: 160 },
  { date: '06/03', Enviadas: 250, Recebidas: 190 },
  { date: '07/03', Enviadas: 190, Recebidas: 130 },
];

export default function WhatsAppPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  
  const [instance, setInstance] = useState<any>({
    tenantId: currentTenantId,
    name: 'Nova Instância',
    status: 'disconnected',
    number: '-',
    lastUpdate: '-',
    provider: 'Evolution API'
  });

  const [status, setStatus] = useState(instance.status);
  const [loading, setLoading] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  // Simulação de busca de dados reais futuramente via services
  React.useEffect(() => {
    if (currentTenantId) {
      setInstance({
        tenantId: currentTenantId,
        name: 'Nova Instância',
        status: 'disconnected',
        number: '-',
        lastUpdate: '-',
        provider: 'Evolution API'
      });
      setStatus('disconnected');
    }
  }, [currentTenantId]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const generateQrCode = () => {
    setLoading(true);
    setQrCodeVisible(false);
    setTimeout(() => {
      setLoading(false);
      setQrCodeVisible(true);
      setStatus('connecting');
    }, 2000);
  };

  const disconnect = () => {
    setStatus('disconnected');
    setQrCodeVisible(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">WhatsApp</h2>
          <p className="text-muted-foreground">Gerencie sua integração com a Evolution API.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Atualizar Status
          </Button>
          {status === 'connected' && (
            <Button variant="destructive" className="gap-2" onClick={disconnect}>
              <Unlink className="h-4 w-4" />
              Desconectar
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Connection Status Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Status da Instância</CardTitle>
            <CardDescription>Informações técnicas da conexão.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-xl border-2 border-dashed">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                status === 'connected' ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
              )}>
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">{instance.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  status === 'connected' ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                )} />
                <span className="text-sm font-medium capitalize">{status === 'connected' ? 'Conectado' : 'Desconectado'}</span>
              </div>
            </div>
 
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Número</span>
                <span className="font-medium">{status === 'connected' ? instance.number : '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">{instance.provider}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Última Conexão</span>
                <span className="font-medium text-xs">{instance.lastUpdate}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2" size="sm">
              <Copy className="h-3 w-3" />
              Copiar Nome da Instância
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Area */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Conectar WhatsApp</CardTitle>
            <CardDescription>Escaneie o QR Code para ativar as automações.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
            {loading ? (
              <QrCodeLoader />
            ) : status === 'connected' ? (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-700">Instância Conectada!</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                    Seu WhatsApp está pronto para enviar lembretes e gerenciar agendamentos.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="flex flex-col items-center p-4 bg-accent rounded-lg border">
                    <Smartphone className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-xs font-bold">Mobile App</span>
                    <span className="text-[10px] text-muted-foreground">Ativo</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-accent rounded-lg border">
                    <RefreshCw className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-xs font-bold">Auto-Sync</span>
                    <span className="text-[10px] text-muted-foreground">Ligado</span>
                  </div>
                </div>
              </div>
            ) : qrCodeVisible ? (
              <div className="text-center space-y-6">
                <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-primary/20 inline-block">
                  <div className="w-64 h-64 bg-slate-100 flex items-center justify-center relative">
                    <QrCode className="h-48 w-48 text-slate-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-56 h-56 border-4 border-primary rounded-lg" />
                    </div>
                    {/* Mock QR Code Content */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-8 opacity-80">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className={cn("rounded-sm", Math.random() > 0.5 ? "bg-black" : "bg-transparent")} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Escaneie o QR Code</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e aponte a câmera para esta tela.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium text-amber-600">O QR Code expira em 45 segundos</span>
                </div>
                <Button variant="outline" onClick={generateQrCode}>Gerar Novo QR Code</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Pronto para conectar?</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Gere um QR Code para vincular seu número de WhatsApp à plataforma.
                  </p>
                </div>
                <Button size="lg" className="px-8 gap-2" onClick={generateQrCode} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Gerar QR Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Volume Chart */}
      <div className="grid gap-6 md:grid-cols-1">
        <AnalyticsCard
          title="Volume de Mensagens"
          subtitle="Total de mensagens enviadas e recebidas via Evolution API nos últimos 7 dias."
        >
          <SimpleBarChart
            data={messageData}
            index="date"
            categories={["Enviadas", "Recebidas"]}
            colors={["#10b981", "#3b82f6"]}
            valueFormatter={(number: number) => number.toString()}
          />
        </AnalyticsCard>
      </div>

      {/* Integration Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Como funciona a integração?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <p>
              Utilizamos a <strong>Evolution API</strong> para fornecer uma conexão estável e segura com o WhatsApp.
            </p>
            <ul className="space-y-2 list-disc pl-4">
              <li>Envio automático de lembretes de agendamento.</li>
              <li>Confirmação de horários em tempo real.</li>
              <li>Recebimento de comprovantes e avisos de pagamento.</li>
              <li>Sincronização de agenda via chat.</li>
            </ul>
            <div className="pt-2">
              <Button variant="link" className="p-0 h-auto text-primary gap-1">
                Ver documentação técnica <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dicas de Conexão</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
              <p>Evite usar números pessoais para automações de alta escala para prevenir bloqueios.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <p>Mantenha seu celular conectado à internet para garantir a sincronização inicial.</p>
            </div>
            <div className="flex gap-3">
              <Smartphone className="h-5 w-5 text-blue-500 shrink-0" />
              <p>Você pode usar o WhatsApp Business para passar mais profissionalismo aos clientes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
