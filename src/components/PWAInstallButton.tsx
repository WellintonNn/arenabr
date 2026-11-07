import React, { useEffect, useState } from 'react';
import { Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Instalar aplicativo PWA"
        className="w-full max-w-[320px] mx-auto py-2.5 px-4 rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-500/25 to-blue-600/35 hover:from-cyan-500/35 hover:to-blue-600/45 text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,217,255,0.3)] transition active:scale-98 cursor-pointer"
      >
        <Smartphone className="w-4 h-4 text-cyan-300 animate-pulse" />
        <span>INSTALAR APP NO DISPOSITIVO</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#0a1420] border border-cyan-400 p-6 shadow-2xl text-center">
            <button
              onClick={() => setShowIOSModal(false)}
              aria-label="Fechar guia"
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-3xl mb-2">📱</div>
            <h3 className="text-base font-black text-cyan-400 tracking-wide mb-2">
              Instalar Bunker25 PWA
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed text-left mb-4">
              {isIOS ? (
                <>
                  1. No <strong>Safari (iOS)</strong>, toque no ícone de <strong>Compartilhar (⎋)</strong> na barra inferior.<br />
                  2. Role para baixo e selecione <strong>"Adicionar à Tela de Início" (➕)</strong>.<br />
                  3. Toque em <strong>"Adicionar"</strong> no topo direito.
                </>
              ) : (
                <>
                  1. Abra as opções do navegador (três pontinhos ⋮).<br />
                  2. Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.<br />
                  3. Confirme a instalação para jogar direto em tela cheia com alta performance.
                </>
              )}
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white uppercase tracking-wider"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
