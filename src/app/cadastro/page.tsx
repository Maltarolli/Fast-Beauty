'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setError('Digite seu nome e sobrenome.');
      return;
    }
    if (nameParts.length > 2) {
      setError('Digite apenas seu primeiro e segundo nome.');
      return;
    }

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
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (authError) {
        console.error('Signup error:', authError);
        if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
          setError('Este e-mail já está cadastrado.');
        } else if (authError.message.includes('valid email')) {
          setError('Digite um e-mail válido.');
        } else {
          setError(`Erro ao criar conta: ${authError.message}`);
        }
        setLoading(false);
        return;
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setError('Este e-mail já está cadastrado.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setError('Erro inesperado. Tente novamente.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="w-24 h-24 rounded-full gradient-accent mx-auto flex items-center justify-center mb-6 animate-pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Conta Criada!
          </h1>
          <p className="text-muted animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Enviamos um link de confirmação para o seu e-mail. Por favor, <strong>confirme seu e-mail</strong> para acessar o sistema.
          </p>
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all h-12 px-8 bg-card border border-border hover:bg-subtle text-foreground w-full">
              Voltar para o Login
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-dark/8 rounded-full blur-[100px]" />
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
          <p className="text-muted text-sm">Crie sua conta e comece seus 15 dias grátis.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="bg-card border border-border rounded-3xl p-8 shadow-theme-lg space-y-5">
          {error && (
            <div className="bg-error-bg border border-error/20 rounded-xl p-4 text-error text-sm animate-fade-in-down flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error shrink-0" />
              {error}
            </div>
          )}

          <Input
            label="Nome e Sobrenome"
            type="text"
            placeholder="Maria Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            error={password.length > 0 && password.length < 6 ? 'Mínimo 6 caracteres' : undefined}
            required
          />

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            error={confirmPassword.length > 0 && password !== confirmPassword ? 'As senhas não coincidem' : undefined}
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Criar Minha Conta
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-muted mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Já tem uma conta?{' '}
          <Link href="/login" className="text-accent hover:text-accent/80 font-semibold transition-colors">
            Entrar no sistema
          </Link>
        </p>
      </div>
    </main>
  );
}
