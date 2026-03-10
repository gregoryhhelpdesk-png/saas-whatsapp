
import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';

type AuthView = 'login' | 'recovery' | 'reset' | 'success';

export default function AuthPage() {
  const { login } = useAuth();
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock auth logic
    setTimeout(() => {
      setLoading(false);
      if (view === 'login') {
        login(email || 'admin@saashed.com');
      } else if (view === 'recovery') {
        setView('success');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto shadow-lg">
            S
          </div>
          <h1 className="text-3xl font-bold tracking-tight">SaaShed</h1>
          <p className="text-muted-foreground">Gestão inteligente para o seu negócio.</p>
        </div>

        <Card className="border-none shadow-xl">
          <form onSubmit={handleSubmit}>
            {view === 'login' && (
              <>
                <CardHeader>
                  <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
                  <CardDescription>Entre com suas credenciais para acessar o painel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        className="pl-9" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <button 
                        type="button"
                        onClick={() => setView('recovery')}
                        className="text-xs text-primary hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type="password" placeholder="••••••••" className="pl-9" />
                    </div>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar no Sistema"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                  <button 
                    type="button"
                    onClick={() => login('admin@saashed.com')}
                    className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    Pular Login (Acesso Rápido)
                  </button>
                </CardFooter>
              </>
            )}

            {view === 'recovery' && (
              <>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView('login')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-medium text-muted-foreground">Voltar ao login</span>
                  </div>
                  <CardTitle className="text-xl">Recuperar Senha</CardTitle>
                  <CardDescription>Enviaremos um link de recuperação para o seu e-mail.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email">E-mail cadastrado</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="recovery-email" type="email" placeholder="seu@email.com" className="pl-9" required />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Link de Recuperação"}
                  </Button>
                </CardFooter>
              </>
            )}

            {view === 'success' && (
              <CardContent className="pt-10 pb-6 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">E-mail Enviado!</h3>
                  <p className="text-sm text-muted-foreground">
                    Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha em instantes.
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setView('login')}>
                  Voltar ao Login
                </Button>
              </CardContent>
            )}
          </form>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          &copy; 2024 SaaShed • Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
