import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Phone, Clock, Info } from "lucide-react";
import Loading from "@/components/ui/loading";

export default function Booking() {
  const { toast } = useToast();
  const [, params] = useRoute("/book/:slug");
  const slug = params?.slug;

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientForm, setClientForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ["/api/public/provider", slug],
    enabled: !!slug,
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/public/provider", slug, "services"],
    enabled: !!slug,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", `/api/public/provider/${slug}/book`, data);
    },
    onSuccess: () => {
      toast({
        title: "Agendamento realizado com sucesso!",
        description: "Você receberá uma confirmação no WhatsApp.",
      });
      // Reset form
      setSelectedService(null);
      setSelectedDate("");
      setSelectedTime("");
      setClientForm({ name: "", phone: "", email: "" });
    },
    onError: (error) => {
      toast({
        title: "Erro no agendamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (providerLoading || servicesLoading) {
    return <Loading />;
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Prestador não encontrado</h1>
            <p className="text-gray-600">O link que você acessou não é válido.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, selecione um serviço, data e horário.",
        variant: "destructive",
      });
      return;
    }

    const appointmentDate = new Date(`${selectedDate}T${selectedTime}:00`);
    
    bookingMutation.mutate({
      serviceId: selectedService.id,
      clientName: clientForm.name,
      clientPhone: clientForm.phone,
      clientEmail: clientForm.email,
      appointmentDate: appointmentDate.toISOString(),
      duration: selectedService.duration,
      price: selectedService.price,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{(provider as any)?.businessName?.[0] || '?'}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{(provider as any)?.businessName || 'Carregando...'}</h1>
                <p className="text-sm text-slate-600">{(provider as any)?.category || ''}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
                alt="Interior do estabelecimento"
                className="w-full md:w-80 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{(provider as any)?.businessName || 'Carregando...'}</h2>
                <p className="text-slate-600 mb-4">
                  {(provider as any)?.description || "Oferecemos serviços de qualidade com profissionais experientes."}
                </p>
                <div className="flex flex-col space-y-2 text-sm text-slate-600">
                  {(provider as any)?.address && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{(provider as any)?.address}</span>
                    </div>
                  )}
                  {(provider as any)?.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{(provider as any)?.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Escolha o Serviço</h3>
                <div className="space-y-4">
                  {Array.isArray(services) && services.map((service: any) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedService?.id === service.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{service.name}</h4>
                          <p className="text-slate-600 text-sm mb-2">{service.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-slate-600">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration} min
                            </span>
                            <span className="text-xl font-bold text-slate-900">
                              R$ {parseFloat(service.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`w-6 h-6 border-2 rounded-full ${
                              selectedService?.id === service.id
                                ? "bg-blue-600 border-blue-600"
                                : "border-slate-300"
                            }`}
                          >
                            {selectedService?.id === service.id && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Date & Time Selection */}
                {selectedService && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Escolha Data e Horário</h3>
                    
                    {/* Date Selection */}
                    <div className="mb-6">
                      <h4 className="font-medium text-slate-900 mb-3">Selecione a Data</h4>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDateSelect(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full"
                      />
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div className="mb-6">
                        <h4 className="font-medium text-slate-900 mb-3">Escolha o Horário</h4>
                        <Input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => handleTimeSelect(e.target.value)}
                          className="w-full max-w-xs"
                          required
                        />
                        <p className="text-sm text-slate-500 mt-2">
                          Selecione o horário desejado para o agendamento
                        </p>
                      </div>
                    )}

                    {/* Client Form */}
                    {selectedDate && selectedTime && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-4">Seus Dados</h4>
                        <form onSubmit={handleBooking} className="space-y-4">
                          <div>
                            <Label>Nome Completo</Label>
                            <Input
                              type="text"
                              value={clientForm.name}
                              onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label>WhatsApp</Label>
                            <Input
                              type="tel"
                              value={clientForm.phone}
                              onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                              required
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                          <div>
                            <Label>Email (opcional)</Label>
                            <Input
                              type="email"
                              value={clientForm.email}
                              onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 h-auto py-4 text-lg font-semibold"
                            disabled={bookingMutation.isPending}
                          >
                            {bookingMutation.isPending ? "Confirmando..." : "Confirmar Agendamento"}
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Resumo do Agendamento</h3>
                
                <div className="space-y-4">
                  {selectedService && (
                    <div className="py-3 border-b border-slate-200">
                      <p className="font-medium text-slate-900">{selectedService.name}</p>
                      <p className="text-sm text-slate-600">{selectedService.duration} min</p>
                      <p className="font-bold text-slate-900">R$ {parseFloat(selectedService.price).toFixed(2)}</p>
                    </div>
                  )}
                  
                  {selectedDate && selectedTime && (
                    <div className="py-3 border-b border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">Data e Horário</p>
                      <p className="font-medium text-slate-900">
                        {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime}
                      </p>
                    </div>
                  )}
                  
                  <div className="py-3">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>R$ {selectedService ? parseFloat(selectedService.price).toFixed(2) : "0,00"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Política de Cancelamento</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Cancelamentos devem ser feitos com até 2 horas de antecedência.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
