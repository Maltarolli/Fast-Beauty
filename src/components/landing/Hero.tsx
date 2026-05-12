'use client';

import Link from 'next/link';
import { ArrowRight, Monitor, Smartphone } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-dark/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-40 dark:opacity-100" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute inset-0 opacity-0 dark:opacity-100" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="animate-fade-in-down inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-glow border border-accent/20 text-accent text-sm font-medium mb-8">
          <span className="animate-bounce-subtle inline-block">✨</span>
          15 dias de teste totalmente grátis
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
          A gestão do seu salão,{' '}
          <span className="gradient-accent-text">simples e na palma da mão.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '0.15s' }}>
          Dê adeus ao caderninho. Controle seus agendamentos, financeiro e estoque em um único lugar. 
          Feito especialmente para manicures e espaços de beleza.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/cadastro"
            className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white gradient-accent rounded-2xl shadow-xl shadow-accent/25 hover:shadow-accent/50 hover:brightness-110 transition-all duration-300 active:scale-[0.97] animate-pulse-glow"
          >
            Começar meu teste grátis
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mockups */}
        <div className="animate-fade-in-up mt-20 relative" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-end justify-center gap-6 md:gap-10">
            {/* Desktop mock */}
            <div className="relative w-full max-w-2xl">
              <div className="bg-card border border-border rounded-2xl p-2 shadow-theme-lg">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-background rounded-lg text-xs text-muted">
                      fastbeauty.app/dashboard
                    </div>
                  </div>
                </div>
                <div className="aspect-[16/9] rounded-xl bg-background overflow-hidden relative">
                  {/* Simulated dashboard UI */}
                  <div className="absolute inset-0 p-4 flex gap-4">
                    {/* Sidebar */}
                    <div className="w-1/5 bg-card/50 rounded-xl p-3 flex flex-col gap-3">
                      <div className="h-6 w-20 bg-accent/20 rounded-lg" />
                      <div className="space-y-2 mt-4">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`h-8 rounded-lg ${i === 1 ? 'bg-accent/20 border border-accent/30' : 'bg-subtle'}`} />
                        ))}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="h-8 w-48 bg-subtle rounded-lg" />
                      <div className="grid grid-cols-3 gap-3 flex-1">
                        <div className="col-span-2 bg-card/50 rounded-xl p-3">
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({length: 35}).map((_, i) => (
                              <div key={i} className={`aspect-square rounded-md ${i === 12 ? 'bg-accent/30 border border-accent/40' : 'bg-subtle'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="bg-card/50 rounded-xl p-3 space-y-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="h-16 bg-subtle rounded-lg" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-lg rounded-full" />
              <Monitor className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 text-muted/30" />
            </div>

            {/* Mobile mock */}
            <div className="relative w-24 sm:w-32 md:w-40 shrink-0 hidden sm:block">
              <div className="bg-card border border-border rounded-2xl p-1.5 shadow-theme-lg">
                <div className="flex justify-center py-1">
                  <div className="w-12 h-1.5 bg-subtle-strong rounded-full" />
                </div>
                <div className="aspect-[9/16] rounded-xl bg-background overflow-hidden relative">
                  <div className="absolute inset-0 p-2 flex flex-col gap-2">
                    <div className="h-5 w-16 bg-accent/20 rounded" />
                    <div className="flex-1 space-y-1.5">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-10 bg-subtle rounded-lg" />
                      ))}
                    </div>
                    <div className="flex justify-around py-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-4 h-4 rounded ${i === 1 ? 'bg-accent/30' : 'bg-subtle'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Smartphone className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 text-muted/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
