
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  UserCheck, 
  ArrowRightLeft, 
  XCircle, 
  Trash2, 
  Zap,
  MessageSquare,
  History,
  CreditCard,
  Edit,
  ExternalLink,
  Check,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTenant } from '@/contexts/TenantContext';
import { Conversation, Message, ConversationStatus, Client } from '@/types';

const statusMap: Record<ConversationStatus, { label: string, color: string }> = {
  new: { label: 'Novo', color: 'bg-blue-500' },
  unread: { label: 'Não Lida', color: 'bg-orange-500' },
  open: { label: 'Aberto', color: 'bg-emerald-500' },
  in_progress: { label: 'Em Atendimento', color: 'bg-purple-500' },
  waiting_customer: { label: 'Aguardando Cliente', color: 'bg-yellow-500' },
  resolved: { label: 'Resolvido', color: 'bg-slate-500' },
  closed: { label: 'Encerrado', color: 'bg-red-500' },
};

export default function InboxPage() {
  const { activeTenantId: currentTenantId } = useTenant();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulação de busca de dados reais futuramente via services
      setConversations([]);
      setClients([]);
      setMessagesMap({});
      setIsLoading(false);
    };

    if (currentTenantId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [currentTenantId]);

  const selectedConversation = useMemo(() => 
    conversations.find(c => c.id === selectedId), 
  [selectedId, conversations]);

  const selectedClient = useMemo(() => 
    selectedConversation?.clientId ? clients.find(c => c.id === selectedConversation.clientId) : null,
  [selectedConversation, clients]);

  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      const matchesSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) || 
                          c.clientPhone.includes(search);
      const matchesFilter = filter === 'all' || c.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter, conversations]);

  const messages = useMemo(() => {
    if (!selectedId) return [];
    return messagesMap[selectedId] || [];
  }, [selectedId, messagesMap]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    // In a real app, we would send this to the backend
    setReply('');
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background border rounded-xl overflow-hidden shadow-sm">
      {/* Coluna 1: Lista de Conversas */}
      <div className="w-80 flex flex-col border-r bg-muted/10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Caixa de Entrada
            </h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar cliente..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-2 pb-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-full h-7 text-xs"
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button 
                variant={filter === 'unread' ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-full h-7 text-xs"
                onClick={() => setFilter('unread')}
              >
                Não Lidas
              </Button>
              <Button 
                variant={filter === 'in_progress' ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-full h-7 text-xs"
                onClick={() => setFilter('in_progress')}
              >
                Em Atendimento
              </Button>
              <Button 
                variant={filter === 'resolved' ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-full h-7 text-xs"
                onClick={() => setFilter('resolved')}
              >
                Resolvidas
              </Button>
            </div>
          </ScrollArea>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={cn(
                  "w-full p-4 text-left hover:bg-muted/50 transition-colors flex gap-3 relative",
                  selectedId === conv.id && "bg-primary/5 border-l-4 border-primary"
                )}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback>{conv.clientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm truncate">{conv.clientName}</span>
                    <span className="text-[10px] text-muted-foreground">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={cn("text-[10px] px-1.5 h-4 font-normal text-white", statusMap[conv.status].color)}>
                      {statusMap[conv.status].label}
                    </Badge>
                    {conv.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground space-y-2">
                <Search className="h-8 w-8 mx-auto opacity-20" />
                <p className="text-sm">Nenhuma conversa encontrada.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Coluna 2: Área de Conversa */}
      <div className="flex-1 flex flex-col bg-background relative">
        {selectedConversation ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b flex items-center justify-between bg-background/50 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{selectedConversation.clientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm">{selectedConversation.clientName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {selectedConversation.clientPhone}
                    </span>
                    <Separator orientation="vertical" className="h-3" />
                    <span className="text-[10px] text-primary font-medium">
                      {selectedConversation.attendantName ? `Atendente: ${selectedConversation.attendantName}` : 'Aguardando atendente'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                  <UserCheck className="h-3.5 w-3.5" /> Assumir
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Check className="h-4 w-4" /> Marcar como lida
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <ArrowRightLeft className="h-4 w-4" /> Transferir conversa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Encerrar atendimento
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Histórico de Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-[10px] bg-muted px-2 py-1 rounded-full text-muted-foreground uppercase tracking-wider font-medium">
                    Hoje
                  </span>
                </div>
                
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      msg.fromMe ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      msg.fromMe 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                      {msg.fromMe && (
                        msg.status === 'read' ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Campo de Resposta */}
            <div className="p-4 border-t bg-background">
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-2 rounded-full">
                    <Zap className="h-3.5 w-3.5 text-yellow-500" /> Respostas Rápidas
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-2 rounded-full" onClick={() => setReply('')}>
                    <Trash2 className="h-3.5 w-3.5" /> Limpar
                  </Button>
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      placeholder="Digite sua mensagem..."
                      className="w-full min-h-[40px] max-h-[120px] p-3 rounded-xl border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
                      rows={1}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="icon" className="h-10 w-10 rounded-xl shrink-0" disabled={!reply.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 opacity-20" />
            </div>
            <div className="max-w-xs space-y-2">
              <h3 className="font-bold text-lg">Selecione uma conversa</h3>
              <p className="text-sm text-muted-foreground">
                Escolha um cliente na lista ao lado para iniciar o atendimento ou visualizar o histórico.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Coluna 3: Painel Lateral do Cliente */}
      <div className="w-80 border-l bg-muted/5 flex flex-col">
        {selectedConversation ? (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              {/* Perfil */}
              <div className="text-center space-y-3">
                <Avatar className="h-20 w-20 mx-auto border-4 border-background shadow-md">
                  <AvatarFallback className="text-2xl">{selectedConversation.clientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{selectedConversation.clientName}</h3>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    {selectedClient?.status === 'active' ? 'Cliente Ativo' : 'Novo Contato'}
                  </Badge>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Informações</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedConversation.clientPhone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground italic">{selectedClient?.email || 'Sem e-mail'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground italic">Sem observações</span>
                  </div>
                </div>
              </div>

              {/* Métricas Operacionais */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resumo</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background p-3 rounded-lg border shadow-sm space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Agendamentos</span>
                    <p className="text-xl font-bold">{selectedClient?.totalAppointments || 0}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg border shadow-sm space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Pendentes</span>
                    <p className="text-xl font-bold text-orange-500">R$ 0,00</p>
                  </div>
                </div>
              </div>

              {/* Próximo Agendamento */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Próximo Passo</h4>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-bold">Amanhã, 10:00</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-medium">Corte de Cabelo</p>
                    <p className="text-muted-foreground">Profissional: Carlos</p>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="space-y-3 pt-4">
                <Button variant="outline" className="w-full justify-start gap-3 h-10 text-sm">
                  <User className="h-4 w-4" /> Ver Perfil Completo
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-10 text-sm">
                  <History className="h-4 w-4" /> Histórico de Agendamentos
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-10 text-sm">
                  <CreditCard className="h-4 w-4" /> Financeiro
                </Button>
                <Separator />
                <Button className="w-full gap-2 h-10 text-sm">
                  <Calendar className="h-4 w-4" /> Novo Agendamento
                </Button>
                {!selectedClient && (
                  <Button variant="secondary" className="w-full gap-2 h-10 text-sm">
                    <UserPlus className="h-4 w-4" /> Criar Cadastro
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <User className="h-12 w-12 opacity-10 mb-2" />
            <p className="text-xs">Selecione uma conversa para ver os detalhes do cliente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
