'use client';

import { AlertTriangle } from 'lucide-react';

interface TrialBannerProps {
  daysLeft: number;
  onSubscribe: () => void;
}

export function TrialBanner({ daysLeft, onSubscribe }: TrialBannerProps) {
  if (daysLeft > 3) return null;

  return (
    <div className="bg-warning-bg border border-warning/20 rounded-2xl p-4 mx-4 mt-4 lg:mx-0 animate-fade-in-down flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-3 flex-1">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
        <p className="text-sm text-warning">
          <span className="font-bold">Seu teste grátis acaba em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}.</span>{' '}
          Adicione uma forma de pagamento para não perder seus dados.
        </p>
      </div>
      <button
        onClick={onSubscribe}
        className="px-5 py-2 text-sm font-semibold text-white gradient-accent rounded-xl hover:brightness-110 transition-all shrink-0 cursor-pointer"
      >
        Assinar
      </button>
    </div>
  );
}
