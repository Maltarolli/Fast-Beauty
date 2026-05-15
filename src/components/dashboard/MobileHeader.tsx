'use client';

import { Sparkles, LogOut, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface MobileHeaderProps {
  userName: string;
}

export function MobileHeader({ userName }: MobileHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/dashboard/perfil" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-semibold truncate max-w-[120px]">{userName}</span>
        </Link>
        
        <Link href="/dashboard" className="flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-base font-extrabold">
            Fast<span className="gradient-accent-text">Beauty</span>.
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/dashboard/ajuda"
            className="p-2 rounded-xl text-muted hover:text-foreground hover-subtle transition-all"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-muted hover:text-error hover:bg-error/5 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
