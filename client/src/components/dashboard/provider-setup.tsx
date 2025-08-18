import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Onboarding } from "@/components/ui/onboarding";
import { Store, ArrowRight, Play } from "lucide-react";

export default function ProviderSetup() {
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});
  const [providerForm, setProviderForm] = useState({
    businessName: "",
    slug: "",
    description: "",
    category: "",
    address: "",
    phone: "",
  });

  const createProviderMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/provider", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider"] });
      toast({ title: "Perfil criado com sucesso!" });
    },
    onError: (error: any) => {
      // Tratar erro específico de slug duplicado
      if (error.message?.includes('URL já está em uso')) {
        toast({
          title: "URL já em uso",
          description: "Tente um nome diferente ou adicione números para torná-lo único",
          variant: "destructive",
        });
        // Gerar novo slug automático
        generateSlug();
      } else {
        toast({
          title: "Erro ao criar perfil",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from business name if not provided
    const slug = providerForm.slug || 
      providerForm.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    createProviderMutation.mutate({
      ...providerForm,
      slug,
    });
  };

  const generateSlug = () => {
    if (providerForm.businessName) {
      const baseSlug = providerForm.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Adicionar timestamp para garantir unicidade
      const timestamp = Date.now().toString().slice(-4);
      const uniqueSlug = `${baseSlug}-${timestamp}`;
      
      setProviderForm({ ...providerForm, slug: uniqueSlug });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Configure seu Negócio
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-300">
            Vamos criar o perfil do seu negócio para que os clientes possam agendar seus serviços.
          </p>
          
          {/* Onboarding Button */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowOnboarding(true)}
              className="flex items-center space-x-2 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Play className="w-4 h-4" />
              <span>Guia Interativo</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="businessName">Nome do Negócio *</Label>
              <Input
                id="businessName"
                type="text"
                value={providerForm.businessName}
                onChange={(e) => setProviderForm({ ...providerForm, businessName: e.target.value })}
                onBlur={generateSlug}
                required
                placeholder="Ex: Salão da Maria"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="slug">URL de Agendamento *</Label>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-slate-600">agendafacil.app/book/</span>
                <Input
                  id="slug"
                  type="text"
                  value={providerForm.slug}
                  onChange={(e) => setProviderForm({ ...providerForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  required
                  placeholder="salao-da-maria"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Esta será a URL que seus clientes usarão para agendar
              </p>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                type="text"
                value={providerForm.category}
                onChange={(e) => setProviderForm({ ...providerForm, category: e.target.value })}
                placeholder="Ex: Salão de Beleza, Consultório, Oficina"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={providerForm.description}
                onChange={(e) => setProviderForm({ ...providerForm, description: e.target.value })}
                rows={3}
                placeholder="Conte um pouco sobre seu negócio..."
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={providerForm.phone}
                  onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  type="text"
                  value={providerForm.address}
                  onChange={(e) => setProviderForm({ ...providerForm, address: e.target.value })}
                  placeholder="Rua, número - Bairro"
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
              disabled={createProviderMutation.isPending}
            >
              {createProviderMutation.isPending ? (
                "Criando perfil..."
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Onboarding Modal */}
      <Onboarding
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onClose={() => setShowOnboarding(false)}
        onSaveProgress={setOnboardingData}
        savedData={onboardingData}
      />
    </div>
  );
}