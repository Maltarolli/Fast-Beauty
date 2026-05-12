'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, Users, Sparkle, DollarSign, Package, User, LogOut, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/servicos', label: 'Serviços', icon: Sparkle },
  { href: '/dashboard/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/dashboard/estoque', label: 'Estoque', icon: Package },
];

interface SidebarProps {
  userName: string;
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-sidebar backdrop-blur-xl border-r border-border z-40">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Sparkles className="w-6 h-6 text-accent transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-xl font-extrabold tracking-tight">
            Fast<span className="gradient-accent-text">Beauty</span>.
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20 shadow-lg shadow-accent/5'
                  : 'text-muted hover:text-foreground hover-subtle'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'drop-shadow-[0_0_6px_rgba(232,121,168,0.4)]')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/dashboard/perfil"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
            pathname === '/dashboard/perfil'
              ? 'bg-accent/10 text-accent'
              : 'text-muted hover:text-foreground hover-subtle'
          )}
        >
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="truncate">{userName || 'Usuário'}</span>
        </Link>
        <Link
          href="/dashboard/ajuda"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
            pathname === '/dashboard/ajuda'
              ? 'bg-accent/10 text-accent'
              : 'text-muted hover:text-foreground hover-subtle'
          )}
        >
          <HelpCircle className={cn('w-5 h-5', pathname === '/dashboard/ajuda' && 'drop-shadow-[0_0_6px_rgba(232,121,168,0.4)]')} />
          Ajuda
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-error hover:bg-error/5 transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}

