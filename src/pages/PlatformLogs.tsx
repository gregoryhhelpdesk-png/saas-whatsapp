import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function PlatformLogs() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [tenants, setTenants] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setLogs([]);
      setTenants([]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getTenantName = (id?: string) => {
    if (!id) return 'Sistema';
    return tenants.find(t => t.id === id)?.name || 'Desconhecido';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs Globais</h1>
          <p className="text-muted-foreground">Histórico completo de eventos e atividades da plataforma.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar eventos..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-500" />
            Eventos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-xs font-mono">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="font-medium">{log.event}</TableCell>
                  <TableCell>{getTenantName(log.tenantId)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      log.type === 'success' ? 'default' : 
                      log.type === 'error' ? 'destructive' : 
                      log.type === 'warning' ? 'secondary' : 
                      'outline'
                    }>
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
