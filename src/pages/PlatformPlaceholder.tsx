import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PlatformPlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function PlatformPlaceholder({ title, description, icon: Icon }: PlatformPlaceholderProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="border-none shadow-md bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Módulo em Desenvolvimento</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              A tela de <strong>{title}</strong> está sendo preparada para oferecer a melhor experiência de gestão global da plataforma.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
