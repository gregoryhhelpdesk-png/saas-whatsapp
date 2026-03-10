
import React from 'react';
import { 
  Bell,
  ChevronDown,
  Search,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { CommandMenu } from '@/components/command-menu';
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { PlatformSidebar } from '@/components/platform-sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function DashboardLayout({ children, activePage, setActivePage }: LayoutProps) {
  const { user, role, scope, setScope, logout } = useAuth();
  const { activeTenantId, activeTenantName, setActiveTenant } = useTenant();

  const isPlatform = scope === 'platform';

  return (
    <SidebarProvider>
      <CommandMenu setActivePage={setActivePage} />
      {isPlatform ? (
        <PlatformSidebar activePage={activePage} setActivePage={setActivePage} />
      ) : (
        <AppSidebar activePage={activePage} setActivePage={setActivePage} />
      )}
      <SidebarInset>
        {activeTenantId && role === 'super_admin' && !isPlatform && (
          <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between text-sm font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Você está visualizando o tenant: <strong>{activeTenantName}</strong></span>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-7 text-xs gap-1"
              onClick={() => {
                setActiveTenant(null, null);
                setScope('platform');
                setActivePage('platform-tenants');
              }}
            >
              <ArrowLeft className="h-3 w-3" />
              Voltar para a Plataforma
            </Button>
          </div>
        )}
        
        <header className={cn(
          "flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[variant=inset]/sidebar-wrapper:h-12 border-b",
          isPlatform && "bg-indigo-50/50 dark:bg-indigo-950/20"
        )}>
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="relative hidden sm:block ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar..." 
                className="pl-9 w-64 lg:w-96 bg-muted/50 border-none focus-visible:ring-1 h-9"
              />
            </div>
            {isPlatform && (
              <div className="ml-4 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-200 dark:border-indigo-800">
                Visão Global
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4 px-4">
            {!isPlatform && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full border">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium">{activeTenantName || "Barbearia Elite"}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>
            )}

            <ModeToggle />

            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "gap-2 px-2 h-9")}>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block text-sm font-medium">{user?.name || "Admin"}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {role === 'super_admin' && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        onClick={() => {
                          const newScope = isPlatform ? 'tenant' : 'platform';
                          setScope(newScope);
                          setActivePage(newScope === 'platform' ? 'platform-dashboard' : 'dashboard');
                        }}
                        className="font-medium text-indigo-600 dark:text-indigo-400"
                      >
                        {isPlatform ? 'Ir para Painel do Tenant' : 'Ir para Painel da Plataforma'}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setActivePage(isPlatform ? 'platform-settings' : 'configuracoes')}>
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Perfil
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-destructive" onClick={logout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-0 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
