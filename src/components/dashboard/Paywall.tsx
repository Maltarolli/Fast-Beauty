'use client';

import { Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

export function Paywall() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Erro ao iniciar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent-dark/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto animate-scale-in">
        {/* Lock icon */}
        <div className="w-24 h-24 rounded-full bg-card border border-border mx-auto flex items-center justify-center mb-8 animate-float">
          <Lock className="w-10 h-10 text-muted" />
        </div>

        <h1 className="text-3xl font-black mb-3">Tempo Esgotado</h1>
        <p className="text-muted mb-8 leading-relaxed">
          Seu período de teste grátis chegou ao fim. Assine agora para não perder sua agenda, clientes e dados financeiros!
        </p>

        {/* Price card */}
        <div className="bg-card border border-border rounded-3xl p-8 mb-6 gradient-border">
          <div className="mb-4">
            <span className="text-4xl font-black gradient-accent-text">{formatCurrency(39.90)}</span>
            <span className="text-muted text-sm">/mês</span>
          </div>
          <p className="text-muted text-sm mb-6">Cancele a qualquer momento.</p>
          <Button onClick={handleSubscribe} loading={loading} className="w-full" size="lg">
            Assinar Agora
          </Button>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
