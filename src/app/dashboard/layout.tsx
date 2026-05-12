'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { TrialBanner } from '@/components/dashboard/TrialBanner';
import { Paywall } from '@/components/dashboard/Paywall';
import { PageSpinner } from '@/components/ui/Spinner';
import { daysRemaining, isTrialExpired } from '@/lib/utils';
import type { Profile } from '@/types/database';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Erro ao iniciar o pagamento.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PageSpinner />
      </div>
    );
  }

  // Check if trial expired and no active subscription
  const isExpired = profile && 
    profile.subscription_status !== 'active' && 
    isTrialExpired(profile.trial_ends_at);

  if (isExpired) {
    return <Paywall />;
  }

  const trialDays = profile ? daysRemaining(profile.trial_ends_at) : 99;
  const showTrialBanner = profile?.subscription_status === 'trialing' && trialDays <= 3;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar userName={profile?.full_name || 'Usuário'} />
      
      {/* Mobile Header */}
      <MobileHeader userName={profile?.full_name || 'Usuário'} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        {showTrialBanner && (
          <TrialBanner daysLeft={trialDays} onSubscribe={handleSubscribe} />
        )}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
