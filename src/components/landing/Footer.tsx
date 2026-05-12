import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="font-bold text-sm">
            Fast<span className="gradient-accent-text">Beauty</span>.
          </span>
        </div>
        <p className="text-muted text-sm">
          © {new Date().getFullYear()} FastBeauty. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
