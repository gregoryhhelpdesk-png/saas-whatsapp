
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserSquare2, 
  Scissors, 
  DollarSign, 
  MessageSquare, 
  Inbox,
  Zap, 
  History, 
  Settings,
  Plus,
  UserPlus,
  CreditCard,
  QrCode,
  Moon,
  Sun,
  Search
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "@/components/theme-provider";

interface CommandMenuProps {
  setActivePage: (page: string) => void;
}

export function CommandMenu({ setActivePage }: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Digite um comando ou busque..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => runCommand(() => setActivePage('dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('inbox'))}>
            <Inbox className="mr-2 h-4 w-4" />
            <span>Caixa de Entrada</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('agenda'))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Agenda</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('clientes'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Clientes</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('profissionais'))}>
            <UserSquare2 className="mr-2 h-4 w-4" />
            <span>Profissionais</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('servicos'))}>
            <Scissors className="mr-2 h-4 w-4" />
            <span>Serviços</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('recebimentos'))}>
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Recebimentos</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('whatsapp'))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>WhatsApp</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('automacoes'))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Automações</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('logs'))}>
            <History className="mr-2 h-4 w-4" />
            <span>Logs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('configuracoes'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Ações Rápidas">
          <CommandItem onSelect={() => runCommand(() => console.log('Novo Agendamento'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Novo Agendamento</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('Novo Cliente'))}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Novo Cliente</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('Nova Cobrança'))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Nova Cobrança</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('whatsapp'))}>
            <QrCode className="mr-2 h-4 w-4" />
            <span>Abrir QR Code WhatsApp</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('inbox'))}>
            <Inbox className="mr-2 h-4 w-4" />
            <span>Ir para Conversas não lidas</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>Alternar Tema</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
