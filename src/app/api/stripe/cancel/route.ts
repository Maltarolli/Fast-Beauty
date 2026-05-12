import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_subscription_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_subscription_id) {
      return NextResponse.json({ error: 'Nenhuma assinatura encontrada' }, { status: 400 });
    }

    // Cancel subscription on Stripe
    await stripe.subscriptions.cancel(profile.stripe_subscription_id);

    // Update profile
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'inactive',
        stripe_subscription_id: null,
      })
      .eq('id', user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stripe cancel error:', error);
    return NextResponse.json({ error: 'Erro ao cancelar assinatura' }, { status: 500 });
  }
}
