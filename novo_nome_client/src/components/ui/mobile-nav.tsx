import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Calendar, Menu, X, Home, Settings, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface MobileNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  providerSlug?: string;
}

const navItems = [
  { id: "overview", label: "Dashboard", icon: Home },
  { id: "services", label: "Serviços", icon: Calendar },
  { id: "availability", label: "Disponibilidade", icon: Calendar },
  { id: "appointments", label: "Agendamentos", icon: Calendar },
];

export function MobileNav({ currentView, onViewChange, providerSlug }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Logout realizado com sucesso!" });
      setIsOpen(false);
    },
  });

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span>AgendaFácil</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-6">
          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Tema</span>
              <ThemeToggle />
            </div>

            {/* Public Page Link */}
            {providerSlug && (
              <Button
                variant="ghost"
                onClick={() => {
                  window.open(`/book/${providerSlug}`, "_blank");
                  setIsOpen(false);
                }}
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ExternalLink className="w-4 h-4 mr-3" />
                Página Pública
              </Button>
            )}

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {logoutMutation.isPending ? "Saindo..." : "Sair"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}


