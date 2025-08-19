import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Onboarding } from "@/components/ui/onboarding";
import { NotificationCenter, Notification } from "@/components/ui/notification-center";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Bell, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Smartphone,
  Zap,
  Palette,
  Users
} from "lucide-react";

export function ImprovementsDemo() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Agendamento confirmado!',
      description: 'Seu horário foi reservado com sucesso para amanhã às 14:00',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
      read: false,
      action: {
        label: 'Ver detalhes',
        onClick: () => console.log('Ver detalhes')
      }
    },
    {
      id: '2',
      type: 'info',
      title: 'Novo cliente registrado',
      description: 'Maria Silva acabou de se cadastrar no seu sistema',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Horário próximo',
      description: 'Você tem um agendamento em 15 minutos',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
      read: true
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (type: Notification['type']) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title: `Notificação de ${type}`,
      description: `Esta é uma notificação de exemplo do tipo ${type}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            🚀 Melhorias Implementadas
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Explore todas as novas funcionalidades e melhorias que foram adicionadas ao AgendaFacil
          </p>
        </div>

        {/* Theme Toggle Section */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Palette className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">🎨 Dark Mode</CardTitle>
            <CardDescription>
              Alternar entre temas claro, escuro e automático
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center space-x-4">
              <ThemeToggle />
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Clique para alternar o tema
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Section */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">📚 Sistema de Onboarding</CardTitle>
            <CardDescription>
              Guia interativo para novos usuários configurarem seus perfis
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => setShowOnboarding(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Experimentar Onboarding
            </Button>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">🔔 Centro de Notificações</CardTitle>
            <CardDescription>
              Sistema avançado de notificações com diferentes tipos e ações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
                onDismiss={handleDismiss}
              />
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Clique no sino para ver as notificações
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => addNotification('success')}
                className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Sucesso
              </Button>
              <Button
                variant="outline"
                onClick={() => addNotification('error')}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Erro
              </Button>
              <Button
                variant="outline"
                onClick={() => addNotification('warning')}
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Aviso
              </Button>
              <Button
                variant="outline"
                onClick={() => addNotification('info')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400"
              >
                <Info className="w-4 h-4 mr-2" />
                Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Improvements Section */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">📱 Melhorias Mobile</CardTitle>
            <CardDescription>
              Navegação otimizada para dispositivos móveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Menu Lateral</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Navegação deslizante para mobile
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Responsivo</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Adaptação automática para todos os tamanhos
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Touch Friendly</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Botões e interações otimizados para toque
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Melhorias Principais</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Responsivo</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Temas Disponíveis</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Possibilidades</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Onboarding Modal */}
      <Onboarding
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  );
}


