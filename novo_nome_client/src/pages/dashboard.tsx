import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Overview from "@/components/dashboard/overview";
import Services from "@/components/dashboard/services";
import Availability from "@/components/dashboard/availability";
import Appointments from "@/components/dashboard/appointments";
import ProviderSetup from "@/components/dashboard/provider-setup";
import Loading from "@/components/ui/loading";

type DashboardView = "overview" | "services" | "availability" | "appointments";

export default function Dashboard() {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<DashboardView>("overview");

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ["/api/provider"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Logout realizado com sucesso!" });
    },
  });

  if (providerLoading) {
    return <Loading />;
  }

  // If user doesn't have a provider profile, show setup
  if (!provider) {
    return <ProviderSetup />;
  }

  const navItems = [
    { id: "overview" as const, label: "Dashboard" },
    { id: "services" as const, label: "Serviços" },
    { id: "availability" as const, label: "Disponibilidade" },
    { id: "appointments" as const, label: "Agendamentos" },
  ];

  const userInitials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Dashboard Header */}
              <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Mobile Navigation */}
              <MobileNav
                currentView={currentView}
                onViewChange={setCurrentView}
                providerSlug={provider?.slug}
              />
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">AgendaFácil</span>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`pb-4 font-medium transition-colors ${
                      currentView === item.id
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {provider && (
                <Button
                  variant="ghost"
                  onClick={() => window.open(`/book/${provider.slug}`, "_blank")}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Página Pública</span>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{userInitials}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "overview" && <Overview user={user} provider={provider} />}
        {currentView === "services" && <Services />}
        {currentView === "availability" && <Availability />}
        {currentView === "appointments" && <Appointments />}
      </main>
    </div>
  );
}
