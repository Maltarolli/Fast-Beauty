'use client';

import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

export function Pricing() {
  return (
    <section className="relative py-24 px-6 flex justify-center items-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Oferta Especial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Simples, acessível e <span className="gradient-accent-text">sem surpresas</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Tudo o que você precisa para decolar seu negócio por um preço justo.
          </p>
        </div>

        <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="relative group w-full max-w-md">
            {/* Animated Glow behind card */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent via-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-50 transition duration-1000 group-hover:duration-500 animate-pulse"></div>

            <div className="bg-card border border-accent/20 rounded-3xl p-8 sm:p-10 w-full shadow-2xl shadow-accent/10 relative overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-accent/30">
              {/* Top decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 gradient-accent" />
              
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-accent">Plano Profissional</h3>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="text-muted text-sm line-through decoration-red-500/50">
                      De R$ 59,99
                    </span>
                    <div className="flex items-end gap-1 justify-center relative">
                      <span className="text-4xl sm:text-5xl font-extrabold gradient-accent-text transition-transform duration-300 group-hover:scale-105">R$ 39,90</span>
                      <span className="text-muted text-sm mb-1 font-medium">/mês</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    'Agenda inteligente ilimitada',
                    'Gestão de clientes e histórico',
                    'Controle financeiro avançado',
                    'Gestão de estoque com alertas',
                    'Acesso de qualquer dispositivo',
                    'Suporte prioritário via WhatsApp'
                  ].map((feature, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 animate-fade-in-up"
                      style={{ animationDelay: `${200 + i * 100}ms` }}
                    >
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                        <Check className="w-3.5 h-3.5 text-accent font-bold" />
                      </div>
                      <span className="text-sm text-foreground font-medium transition-colors group-hover:text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/cadastro"
                  className="relative overflow-hidden block w-full py-4 px-6 text-center text-sm font-semibold text-white gradient-accent rounded-xl shadow-lg shadow-accent/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-accent/40 active:scale-[0.97]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:-translate-y-full transition-transform duration-700 ease-in-out"></div>
                  <span className="relative z-10">Teste Grátis Agora</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
