'use client';

import { useEffect, useState } from 'react';
import { Smartphone, Download, X, Share, AppWindow } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);
  const [showAppGuide, setShowAppGuide] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('SW registration failed:', err);
      });
    }

    // 2. Check if already installed / standalone
    const checkStandalone = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true;
      return isStandalone;
    };

    if (checkStandalone()) {
      return; // If already installed and running standalone, do not show
    }

    // 3. Check if user already dismissed the prompt in this session
    const isDismissed = sessionStorage.getItem('fastbeauty-pwa-dismissed') === 'true';
    if (isDismissed) {
      return;
    }

    // 4. Check if PWA is installed on device (related apps)
    const checkInstalledApps = async () => {
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await (navigator as any).getInstalledRelatedApps();
          if (relatedApps && relatedApps.length > 0) {
            setIsAlreadyInstalled(true);
            setShowPrompt(true);
            return true;
          }
        } catch (err) {
          console.error('Failed to get installed related apps:', err);
        }
      }
      return false;
    };

    // 5. Detect iOS
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = !/crios|fxios|opr\//.test(userAgent) && /safari/.test(userAgent);
      return isIphoneOrIpad && isSafari;
    };

    const init = async () => {
      const isInstalled = await checkInstalledApps();
      if (isInstalled) return;

      const ios = checkIOS();
      setIsIOS(ios);

      if (ios) {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 4000);
        return () => clearTimeout(timer);
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };

    let cleanupFn: any;
    init().then((cleanup) => {
      cleanupFn = cleanup;
    });

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, []);

  const handleInstallClick = async () => {
    if (isAlreadyInstalled) {
      setShowAppGuide(true);
      return;
    }

    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('fastbeauty-pwa-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Banner flutuante no rodapé */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg animate-scale-in">
        <div className="glass border border-accent/25 rounded-3xl p-4 md:p-5 shadow-theme-lg relative flex flex-col gap-4">
          
          {/* Botão de Fechar "X" */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted hover:text-foreground transition-colors p-1.5 hover:bg-subtle rounded-xl cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-4 items-start pr-8">
            <div className="w-12 h-12 rounded-2xl bg-accent-glow border border-accent/15 flex items-center justify-center text-accent shrink-0 animate-pulse-glow">
              {isAlreadyInstalled ? <AppWindow className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                {isAlreadyInstalled ? 'Aplicativo Instalado' : 'Instalar como Aplicativo'}
              </h4>
              <p className="text-xs text-muted mt-1 leading-normal">
                {isAlreadyInstalled 
                  ? 'Você já possui o FastBeauty instalado! Abra-o diretamente da sua tela inicial ou gaveta de aplicativos para uma melhor experiência.'
                  : 'Instale o FastBeauty no seu celular ou computador para acessar de forma rápida e segura direto da sua tela inicial.'
                }
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-muted hover:text-foreground hover:bg-subtle transition-all cursor-pointer"
            >
              Agora não
            </button>
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="text-xs font-bold shadow-md shadow-accent/10 px-5 py-2.5"
            >
              {isAlreadyInstalled ? (
                <>
                  <AppWindow className="w-3.5 h-3.5" />
                  Como Abrir
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  {isIOS ? 'Como Instalar' : 'Instalar App'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal / Guia de instalação para iOS */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-theme-lg space-y-5 animate-scale-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-accent-glow border border-accent/15 flex items-center justify-center text-accent mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Instalar no iPhone / iPad</h3>
              <p className="text-xs text-muted">Siga estes simples passos para adicionar à tela inicial:</p>
            </div>

            <div className="space-y-4 text-sm text-foreground/95">
              <div className="flex gap-3 items-center bg-subtle p-3 rounded-2xl border border-border/40">
                <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">1</span>
                <span className="flex items-center gap-1.5">
                  Toque no ícone de compartilhar <Share className="w-4 h-4 text-accent inline" />
                </span>
              </div>
              <div className="flex gap-3 items-center bg-subtle p-3 rounded-2xl border border-border/40">
                <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Role a tela e toque em <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong></span>
              </div>
            </div>

            <Button onClick={() => setShowIOSGuide(false)} className="w-full" size="md">
              Entendido
            </Button>
          </div>
        </div>
      )}

      {/* Modal / Guia para abrir o App já instalado */}
      {showAppGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-theme-lg space-y-5 animate-scale-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-accent-glow border border-accent/15 flex items-center justify-center text-accent mx-auto">
                <AppWindow className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Como abrir o Aplicativo</h3>
              <p className="text-xs text-muted">O FastBeauty já está instalado no seu dispositivo:</p>
            </div>

            <div className="space-y-3 text-sm text-foreground/95">
              <div className="bg-subtle p-3 rounded-2xl border border-border/40 space-y-1">
                <strong className="text-xs text-accent uppercase tracking-wider block">No Celular (Android)</strong>
                <p className="text-xs text-muted leading-relaxed">Procure pelo ícone do <strong>FastBeauty</strong> na sua lista de aplicativos ou na tela de início.</p>
              </div>
              <div className="bg-subtle p-3 rounded-2xl border border-border/40 space-y-1">
                <strong className="text-xs text-accent uppercase tracking-wider block">No Computador (Windows/Mac)</strong>
                <p className="text-xs text-muted leading-relaxed">Verifique na sua Área de Trabalho ou no menu de programas/aplicativos instalados.</p>
              </div>
            </div>

            <Button onClick={() => setShowAppGuide(false)} className="w-full" size="md">
              Entendido
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
