import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Smartphone,
  Zap,
  History,
  Settings,
  ShieldCheck,
  Activity,
  DollarSign,
  Package,
  LogOut,
  User,
  MoreHorizontal,
  Globe,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import { useAuth } from "../contexts/AuthContext"

const data = {
  groups: [
    {
      label: "Plataforma",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, id: "platform-dashboard" },
        { title: "Tenants", icon: Building2, id: "platform-tenants" },
        { title: "Usuários", icon: Users, id: "platform-users" },
      ],
    },
    {
      label: "Comercial",
      items: [
        { title: "Planos", icon: Package, id: "platform-plans" },
        { title: "Financeiro & Assinaturas", icon: DollarSign, id: "platform-finance" },
      ],
    },
    {
      label: "Operação",
      items: [
        { title: "Instâncias WhatsApp", icon: Smartphone, id: "platform-whatsapp" },
        { title: "Integrações", icon: Zap, id: "platform-integrations" },
        { title: "Webhooks", icon: Globe, id: "platform-webhooks" },
        { title: "Logs Globais", icon: History, id: "platform-logs" },
      ],
    },
    {
      label: "Técnico",
      items: [
        { title: "Auditoria", icon: ShieldCheck, id: "platform-audit" },
        { title: "Monitoramento", icon: Activity, id: "platform-monitoring" },
      ],
    },
    {
      label: "Sistema",
      items: [
        { title: "Configurações", icon: Settings, id: "platform-settings" },
      ],
    },
  ],
}

interface PlatformSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activePage: string
  setActivePage: (page: string) => void
}

export function PlatformSidebar({ activePage, setActivePage, ...props }: PlatformSidebarProps) {
  const { user, logout, switchContext } = useAuth()

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShieldCheck className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SaaSHed Platform</span>
                <span className="truncate text-xs">Super Admin</span>
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
                      <AvatarFallback className="rounded-lg">SA</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">Super Admin</span>
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
                <DropdownMenuItem className="gap-2" onClick={() => switchContext('tenant')}>
                  <LayoutDashboard className="size-4" />
                  Painel do Tenant
                </DropdownMenuItem>
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
