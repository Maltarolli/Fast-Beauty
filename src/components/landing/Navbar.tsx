'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-theme' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-accent transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M19 3v4"/>
              <path d="M17 5h4"/>
              <circle cx="5" cy="19" r="1.5"/>
            </svg>
            <div className="absolute inset-0 w-6 h-6 bg-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Fast<span className="gradient-accent-text">Beauty</span>.
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors duration-200 rounded-xl hover-subtle"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-5 py-2.5 text-sm font-semibold text-white gradient-accent rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:brightness-110 transition-all duration-300 active:scale-[0.97]"
          >
            Testar Grátis
          </Link>
        </div>
      </div>
    </nav>
  );
}
