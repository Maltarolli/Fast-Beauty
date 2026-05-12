'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
      });

      if (resetError) {
        setError('Erro ao enviar e-mail. Tente novamente.');
        return;
      }

      setSent(true);
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-scale-in">
          <div className="w-24 h-24 rounded-full gradient-accent mx-auto flex items-center justify-center mb-6 animate-pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            E-mail Enviado!
          </h1>
          <p className="text-muted animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Verifique sua caixa de entrada (e spam) em <strong className="text-foreground">{email}</strong>. Clique no link para redefinir sua senha.
          </p>
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent-dark/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <Sparkles className="w-8 h-8 text-accent transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-3xl font-black tracking-tight">
              Fast<span className="gradient-accent-text">Beauty</span>.
            </span>
          </Link>
          <p className="text-muted text-sm">Digite seu e-mail para receber o link de redefinição</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 shadow-theme-lg space-y-5">
          {error && (
            <div className="bg-error-bg border border-error/20 rounded-xl p-4 text-error text-sm animate-fade-in-down flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error shrink-0" />
              {error}
            </div>
          )}

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Enviar Link de Redefinição
          </Button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm text-muted mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link href="/login" className="inline-flex items-center gap-1 text-accent hover:text-accent/80 font-semibold transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  );
}
