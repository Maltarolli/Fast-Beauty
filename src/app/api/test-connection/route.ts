import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if variables exist
  if (!url || !key) {
    return NextResponse.json({
      status: '❌ ERRO',
      message: 'Variáveis de ambiente não encontradas',
      NEXT_PUBLIC_SUPABASE_URL: url ? '✅ Definida' : '❌ Faltando',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? '✅ Definida' : '❌ Faltando',
    });
  }

  // Check format
  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    return NextResponse.json({
      status: '❌ ERRO',
      message: 'URL do Supabase parece incorreta. Deve ser algo como: https://xxxxx.supabase.co',
      url_atual: url,
    });
  }

  // Try to connect
  try {
    const supabase = createClient(url, key);
    
    // Test auth connection
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      return NextResponse.json({
        status: '❌ ERRO de Auth',
        message: authError.message,
        dica: 'Verifique se a ANON_KEY está correta no Supabase Dashboard > Settings > API',
      });
    }

    // Test database connection - try to access profiles table
    const { error: dbError } = await supabase.from('profiles').select('id').limit(1);

    if (dbError) {
      return NextResponse.json({
        status: '⚠️ Auth OK, mas banco com erro',
        auth: '✅ Conexão com Auth funcionando',
        database_error: dbError.message,
        dica: 'Você já executou o supabase-schema.sql no SQL Editor do Supabase?',
      });
    }

    return NextResponse.json({
      status: '✅ TUDO CERTO!',
      auth: '✅ Conexão com Auth funcionando',
      database: '✅ Tabela profiles encontrada',
      url: url,
      message: 'Supabase está conectado e pronto para usar!',
    });

  } catch (err) {
    return NextResponse.json({
      status: '❌ ERRO de conexão',
      message: String(err),
      dica: 'Verifique se a URL e a ANON_KEY estão corretas',
    });
  }
}
