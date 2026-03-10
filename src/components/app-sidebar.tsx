
import * as React from "react"
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Users,
  UserSquare2,
  Scissors,
  DollarSign,
  Zap,
  History,
  Settings,
  MoreHorizontal,
  LogOut,
  User,
  Smartphone,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

const data = {
  groups: [
    {
      label: "Principal",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
        { title: "Agenda", icon: Calendar, id: "agenda" },
        { title: "Caixa de Entrada", icon: MessageSquare, id: "inbox", badge: "3" },
      ],
    },
    {
      label: "Cadastros",
      items: [
        { title: "Clientes", icon: Users, id: "clientes" },
        { title: "Profissionais", icon: UserSquare2, id: "profissionais" },
        { title: "Serviços", icon: Scissors, id: "servicos" },
      ],
    },
    {
      label: "Financeiro",
      items: [
        { title: "Recebimentos", icon: DollarSign, id: "recebimentos" },
      ],
    },
    {
      label: "Operação",
      items: [
        { title: "WhatsApp", icon: Smartphone, id: "whatsapp" },
        { title: "Automações", icon: Zap, id: "automacoes" },
        { title: "Logs", icon: History, id: "logs" },
      ],
    },
    {
      label: "Sistema",
      items: [
        { title: "Configurações", icon: Settings, id: "configuracoes" },
      ],
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activePage: string
  setActivePage: (page: string) => void
}

export function AppSidebar({ activePage, setActivePage, ...props }: AppSidebarProps) {
  const { state } = useSidebar()
  const { user, logout } = useAuth()

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SaaSHed</span>
                <span className="truncate text-xs">Sistema de Gestão</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={activePage === item.id}
                      onClick={() => setActivePage(item.id)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">{user?.name?.substring(0, 2).toUpperCase() || 'US'}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">{user?.role === 'super_admin' ? 'Super Admin' : 'Administrador'}</span>
                    </div>
                    <MoreHorizontal className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2">
                  <User className="size-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings className="size-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive" onClick={logout}>
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
