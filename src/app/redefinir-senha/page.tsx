'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        if (updateError.message.includes('same_password')) {
          setError('A nova senha deve ser diferente da senha atual.');
        } else {
          setError('Erro ao atualizar a senha. Tente novamente.');
        }
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Verificando sessão...</div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-scale-in">
          <div className="w-24 h-24 rounded-full gradient-accent mx-auto flex items-center justify-center mb-6 animate-pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Senha Atualizada!
          </h1>
          <p className="text-muted animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Sua senha foi alterada com sucesso. Redirecionando...
          </p>
          <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="w-48 h-1 bg-subtle-strong rounded-full mx-auto overflow-hidden">
              <div className="h-full gradient-accent rounded-full animate-[shimmer_3s_linear]" style={{ width: '100%' }} />
            </div>
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
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <p className="text-muted text-sm">Crie sua nova senha</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 shadow-theme-lg space-y-5">
          {error && (
            <div className="bg-error-bg border border-error/20 rounded-xl p-4 text-error text-sm animate-fade-in-down flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error shrink-0" />
              {error}
            </div>
          )}

          <div className="relative">
            <Input
              label="Nova Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              error={password.length > 0 && password.length < 6 ? 'Mínimo 6 caracteres' : undefined}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirmar Nova Senha"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              error={confirmPassword.length > 0 && password !== confirmPassword ? 'As senhas não coincidem' : undefined}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-[42px] text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Salvar Nova Senha
          </Button>
        </form>
      </div>
    </main>
  );
}
