
import React from 'react';
import { Loader2, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PageLoader = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium animate-pulse text-muted-foreground">Carregando sistema...</p>
    </div>
  </div>
);

export const SectionLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center p-8 w-full h-full min-h-[200px]", className)}>
    <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
  </div>
);

export const TableLoader = ({ rows = 5 }: { rows?: number }) => (
  <div className="w-full space-y-4 p-4">
    <div className="h-10 bg-muted/50 rounded-lg animate-pulse w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <div className="h-12 bg-muted/30 rounded-lg animate-pulse flex-1" />
        <div className="h-12 bg-muted/30 rounded-lg animate-pulse w-24" />
        <div className="h-12 bg-muted/30 rounded-lg animate-pulse w-12" />
      </div>
    ))}
  </div>
);

export const ButtonLoader = ({ children, loading }: { children: React.ReactNode, loading: boolean }) => (
  <div className="flex items-center gap-2">
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </div>
);

export const QrCodeLoader = () => (
  <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/20 space-y-4">
    <div className="relative">
      <QrCode className="h-32 w-32 text-muted-foreground/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
    <div className="text-center space-y-1">
      <p className="text-sm font-bold">Gerando QR Code</p>
      <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos...</p>
    </div>
  </div>
);
