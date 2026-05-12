'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('E-mail ou senha incorretos.');
        } else {
          setError('Erro ao fazer login. Tente novamente.');
        }
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-muted text-sm">Acesse sua conta para continuar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-card border border-border rounded-3xl p-8 shadow-theme-lg space-y-5">
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

          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-md border border-border bg-card peer-checked:bg-accent peer-checked:border-accent transition-all duration-200 flex items-center justify-center">
                  {remember && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                Lembrar de mim
              </span>
            </label>

            <Link
              href="/esqueci-senha"
              className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Acessar Sistema
          </Button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-muted mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="text-accent hover:text-accent/80 font-semibold transition-colors">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </main>
  );
}
