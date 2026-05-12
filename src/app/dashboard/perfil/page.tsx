'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User, Lock, CreditCard, AlertTriangle, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useTheme } from '@/components/ThemeProvider';
import type { Profile } from '@/types/database';

export default function PerfilPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Cancel subscription
  const [showCancel, setShowCancel] = useState(false);
  const [cancelStep, setCancelStep] = useState(1);
  const [cancelPassword, setCancelPassword] = useState('');
  const [canceling, setCanceling] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setProfile(data);
      setDisplayName(data.full_name);
    }
  };

  const handleVerifyPassword = async () => {
    setVerifying(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profile?.email || '',
        password: currentPassword,
      });
      if (authError) {
        setError('Senha atual incorreta.');
      } else {
        setPasswordVerified(true);
      }
    } catch {
      setError('Erro ao verificar senha.');
    }
    setVerifying(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const supabase = createClient();

      // Update name
      if (profile) {
        await supabase.from('profiles').update({ full_name: displayName }).eq('id', profile.id);
      }

      // Update password if provided
      if (newPassword) {
        if (newPassword.length < 6) {
          setError('A nova senha deve ter no mínimo 6 caracteres.');
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setError('As senhas não coincidem.');
          setSaving(false);
          return;
        }
        const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
        if (pwError) {
          setError('Erro ao atualizar senha.');
          setSaving(false);
          return;
        }
      }

      setMessage('Alterações salvas com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordVerified(false);
    } catch {
      setError('Erro ao salvar.');
    }
    setSaving(false);
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      // Verify password
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profile?.email || '',
        password: cancelPassword,
      });
      if (authError) {
        setError('Senha incorreta.');
        setCanceling(false);
        return;
      }

      // Cancel via API
      const response = await fetch('/api/stripe/cancel', { method: 'POST' });
      if (!response.ok) throw new Error('Failed');

      // Logout
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch {
      setError('Erro ao cancelar assinatura.');
    }
    setCanceling(false);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-black mb-8">Perfil</h1>

      {/* Messages */}
      {message && (
        <div className="bg-success-bg border border-success/20 rounded-xl p-4 text-success text-sm mb-6 animate-fade-in-down">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-error-bg border border-error/20 rounded-xl p-4 text-error text-sm mb-6 animate-fade-in-down">
          {error}
        </div>
      )}

      {/* Section 0: Theme */}
      <div className="bg-card border border-border rounded-3xl p-6 mb-6 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          {theme === 'dark' ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
          <h2 className="text-lg font-bold">Aparência</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</p>
            <p className="text-xs text-muted mt-0.5">Alterne entre o modo claro e escuro</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative flex items-center w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer ${
              theme === 'dark' ? 'bg-accent' : 'bg-subtle-strong'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${
                theme === 'dark' ? 'translate-x-[30px]' : 'translate-x-[6px]'
              }`}
            >
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-accent" />
              ) : (
                <Sun className="w-3 h-3 text-amber-500" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Section 1: Info */}
      <div className="bg-card border border-border rounded-3xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">Informações</h2>
        </div>
        <div className="space-y-4">
          <Input label="E-mail" value={profile?.email || ''} disabled className="opacity-60" />
          <Input label="Nome de Exibição" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>
      </div>

      {/* Section 2: Password */}
      <div className="bg-card border border-border rounded-3xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">Alterar Senha</h2>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Senha Atual"
                type="password"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                onChange={e => { setCurrentPassword(e.target.value); setPasswordVerified(false); }}
              />
            </div>
            <Button
              variant="secondary"
              onClick={handleVerifyPassword}
              loading={verifying}
              disabled={!currentPassword}
              className="mb-0.5"
            >
              Verificar
            </Button>
          </div>
          {passwordVerified && (
            <div className="text-xs text-success animate-fade-in-down">✓ Senha verificada</div>
          )}
          <Input
            label="Nova Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={!passwordVerified}
          />
          <Input
            label="Confirmar Nova Senha"
            type="password"
            placeholder="Repita a nova senha"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={!passwordVerified}
            error={confirmPassword && newPassword !== confirmPassword ? 'As senhas não coincidem' : undefined}
          />
        </div>
      </div>

      {/* Section 3: Cancel Subscription */}
      {profile?.subscription_status === 'active' && (
        <div className="bg-card border border-error/20 rounded-3xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-error" />
            <h2 className="text-lg font-bold">Cancelar Assinatura</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            Ao cancelar, você perderá o acesso ao sistema no fim do período atual.
          </p>
          <Button variant="danger" onClick={() => { setShowCancel(true); setCancelStep(1); }}>
            Cancelar Minha Assinatura
          </Button>
        </div>
      )}

      {/* Save button */}
      <Button onClick={handleSave} loading={saving} className="w-full" size="lg">
        Salvar Alterações
      </Button>

      {/* Cancel Modal */}
      <Modal isOpen={showCancel} onClose={() => setShowCancel(false)} title="Cancelar Assinatura">
        {cancelStep === 1 ? (
          <div className="text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
            <h3 className="text-lg font-bold">Tem certeza?</h3>
            <p className="text-sm text-muted">
              Ao cancelar sua assinatura, você perderá o acesso à agenda, clientes e dados financeiros quando o período atual expirar.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={() => setCancelStep(2)} className="flex-1">
                Sim, quero cancelar
              </Button>
              <Button variant="secondary" onClick={() => setShowCancel(false)} className="flex-1">
                Não, manter assinatura
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Confirme sua identidade</h3>
            <p className="text-sm text-muted">Digite sua senha para confirmar o cancelamento.</p>
            <Input
              type="password"
              placeholder="Sua senha"
              value={cancelPassword}
              onChange={e => setCancelPassword(e.target.value)}
            />
            <Button variant="danger" onClick={handleCancelSubscription} loading={canceling} className="w-full">
              Cancelar Assinatura Definitivamente
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
