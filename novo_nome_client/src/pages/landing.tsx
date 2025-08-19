import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { EmailVerification } from "@/components/ui/email-verification";
import { Calendar, CalendarDays, Users, BarChart3, X, Mail, CheckCircle } from "lucide-react";

export default function Landing() {
  const { toast } = useToast();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationData, setVerificationData] = useState<{ userId: string; email: string; name: string } | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLoginOpen(false);
      toast({ title: "Login realizado com sucesso!" });
    },
    onError: (error) => {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setRegisterOpen(false);
      
      // Mostrar modal de verificação
      setVerificationData({
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name
      });
      setVerificationOpen(true);
      
      toast({ 
        title: "Conta criada com sucesso!", 
        description: "Verifique seu email para confirmar a conta"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no registro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">AgendaFácil</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={() => setLoginOpen(true)}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium"
              >
                Entrar
              </Button>
              <Button
                onClick={() => setRegisterOpen(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 font-medium"
              >
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Simplifique seus
            <span className="text-blue-600"> agendamentos</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Plataforma completa para prestadores de serviços gerenciarem horários, 
            serviços e agendamentos com facilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setRegisterOpen(true)}
              className="bg-blue-600 text-white px-8 py-4 hover:bg-blue-700 font-semibold text-lg h-auto"
            >
              Criar Conta Grátis
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setRegisterOpen(true)}
              className="border-2 border-slate-300 text-slate-700 px-8 py-4 hover:border-slate-400 font-semibold text-lg h-auto"
            >
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Gestão de Horários</h3>
            <p className="text-slate-600">Configure sua disponibilidade e bloqueie datas específicas facilmente.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Agendamento Online</h3>
            <p className="text-slate-600">Seus clientes podem agendar diretamente pela sua página personalizada.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Relatórios</h3>
            <p className="text-slate-600">Acompanhe suas métricas e performance dos seus serviços.</p>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 text-center mb-2">
              Bem-vindo de volta
            </DialogTitle>
            <p className="text-slate-600 text-center">Entre na sua conta para continuar</p>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium text-slate-700">Email</Label>
              <Input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                className="mt-2"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Senha</Label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                className="mt-2"
                placeholder="••••••••"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="text-center mt-6">
            <p className="text-slate-600">
              Não tem uma conta?{" "}
              <button
                onClick={() => {
                  setLoginOpen(false);
                  setRegisterOpen(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Criar conta
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 text-center mb-2">
              Criar Conta
            </DialogTitle>
            <p className="text-slate-600 text-center">Comece gratuitamente hoje mesmo</p>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium text-slate-700">Nome Completo</Label>
              <Input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
                className="mt-2"
                placeholder="João Silva"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Email</Label>
              <Input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                className="mt-2"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Senha</Label>
              <Input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                minLength={6}
                className="mt-2"
                placeholder="••••••••"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>
          <div className="text-center mt-6">
            <p className="text-slate-600">
              Já tem uma conta?{" "}
              <button
                onClick={() => {
                  setRegisterOpen(false);
                  setLoginOpen(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Fazer login
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Verification Modal */}
      {verificationData && (
        <EmailVerification
          isOpen={verificationOpen}
          onClose={() => setVerificationOpen(false)}
          onVerified={() => {
            setVerificationOpen(false);
            setVerificationData(null);
            toast({
              title: "Email verificado!",
              description: "Sua conta foi confirmada com sucesso",
            });
          }}
          email={verificationData.email}
          userId={verificationData.userId}
          userName={verificationData.name}
        />
      )}
    </div>
  );
}
