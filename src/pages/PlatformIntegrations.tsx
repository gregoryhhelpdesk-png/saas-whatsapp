import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export default function PlatformIntegrations() {
  const [integrations, setIntegrations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setIntegrations([]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
        <p className="text-muted-foreground">Status dos serviços externos e APIs conectadas à plataforma.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <CardDescription className="capitalize">{integration.type}</CardDescription>
              </div>
              <div className={`p-2 rounded-full ${
                integration.status === 'online' ? 'bg-emerald-100 text-emerald-600' : 
                integration.status === 'degraded' ? 'bg-amber-100 text-amber-600' : 
                'bg-destructive/10 text-destructive'
              }`}>
                {integration.status === 'online' ? <CheckCircle2 className="h-5 w-5" /> : 
                 integration.status === 'degraded' ? <AlertTriangle className="h-5 w-5" /> : 
                 <XCircle className="h-5 w-5" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Última verificação
                  </span>
                  <span>{integration.lastCheck}</span>
                </div>
                {integration.latency && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Latência média</span>
                    <span className={integration.latency > 500 ? "text-amber-600 font-medium" : "text-emerald-600 font-medium"}>
                      {integration.latency}ms
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={
                    integration.status === 'online' ? 'default' : 
                    integration.status === 'degraded' ? 'secondary' : 
                    'destructive'
                  }>
                    {integration.status === 'online' ? 'Operacional' : 
                     integration.status === 'degraded' ? 'Instável' : 
                     'Fora do ar'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {integrations.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            Nenhuma integração configurada.
          </div>
        )}
      </div>
    </div>
  );
}
