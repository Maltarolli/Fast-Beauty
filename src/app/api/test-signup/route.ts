import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  return NextResponse.json({
    success: !error,
    error: error ? { message: error.message, status: error.status, name: error.name } : null,
    user: data?.user ? {
      id: data.user.id,
      email: data.user.email,
      confirmed: data.user.confirmed_at,
      identities: data.user.identities?.length,
      email_confirmed: !!data.user.email_confirmed_at,
    } : null,
    session: data?.session ? 'Session exists (auto-login OK)' : 'No session (email confirmation required?)',
  });
}
