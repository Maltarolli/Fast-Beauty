'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Sparkle, DollarSign, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/servicos', label: 'Serviços', icon: Sparkle },
  { href: '/dashboard/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/dashboard/estoque', label: 'Estoque', icon: Package },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'mobile-nav-item flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-xs font-medium min-w-[56px]',
                isActive ? 'active text-accent' : 'text-muted'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
