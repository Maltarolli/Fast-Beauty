'use client';

import { Calendar, DollarSign, Package } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    description: 'Visualize horários, evite choques de agendamento, bloqueie dias de folga. Tudo organizado em um calendário bonito e fácil de usar.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: DollarSign,
    title: 'Financeiro Automático',
    description: 'Saiba quanto entrou e saiu no mês. Controle de recebimentos, lucros e despesas fixas com relatórios em PDF.',
    gradient: 'from-emerald-500/20 to-green-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  {
    icon: Package,
    title: 'Controle de Estoque',
    description: 'Não deixe faltar material. Dê baixa nos produtos, receba alertas quando estiver acabando e registre compras facilmente.',
    gradient: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
];

export function Features() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Tudo o que você precisa,{' '}
            <span className="gradient-accent-text">em um só lugar</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Ferramentas pensadas para facilitar seu dia a dia como profissional da beleza.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative bg-card border ${feature.borderColor} rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 animate-fade-in-up`}
            >
              {/* Gradient bg on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-subtle border border-border flex items-center justify-center mb-6 ${feature.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <feature.icon className="w-7 h-7" />
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
