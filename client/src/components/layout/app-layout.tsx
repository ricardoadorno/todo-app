"use client";

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, ListChecks, Repeat, DollarSign, Target, HeartPulse, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

const navItems = [
  { href: '/', label: 'Painel', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tarefas', icon: ListChecks },
  { href: '/habits', label: 'Hábitos', icon: Repeat },
  { href: '/finances', label: 'Finanças', icon: DollarSign },
  { href: '/goals', label: 'Metas', icon: Target },
  { href: '/health', label: 'Saúde', icon: HeartPulse },
  { href: '/settings', label: 'Configurações', icon: SettingsIcon },
];

// Simple SVG Logo for Routine Flow
const RoutineFlowLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-8 h-8 text-primary">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity:1}} />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#grad1)" />
    <path d="M60 100 L90 130 L150 70" stroke="hsl(var(--primary-foreground))" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


export default function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <RoutineFlowLogo />
            <span className="font-headline text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Fluxo de Rotina
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                    tooltip={{ children: item.label, side: 'right', className: "font-body" }}
                    className="w-full justify-start font-medium"
                    variant="default"
                  >
                    <item.icon className="h-5 w-5 text-sidebar-foreground/80 group-data-[active=true]:text-sidebar-primary-foreground" />
                    <span className="group-data-[collapsible=icon]:hidden text-sidebar-foreground/90 group-data-[active=true]:text-sidebar-primary-foreground">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-2">
                 <SidebarTrigger className="md:hidden" />
                 <h1 className="font-headline text-2xl font-semibold text-foreground">{pageTitle}</h1>
            </div>
           {/* Futuro: Perfil do Usuário/Ações ex. <UserNav /> */}
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
         <footer className="border-t p-4 text-center text-sm text-muted-foreground bg-background">
            © {new Date().getFullYear()} Fluxo de Rotina. Criado com cuidado.
          </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
