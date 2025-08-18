import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Clock, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateAppointment() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    serviceId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    date: "",
    time: "",
    notes: "",
  });

  const { data: services, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ["/api/services"],
    retry: false,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const appointmentDate = new Date(`${data.date}T${data.time}:00`);
      const service = Array.isArray(services) ? services.find((s: any) => s.id === data.serviceId) : null;
      
      await apiRequest("POST", "/api/appointments", {
        serviceId: data.serviceId,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        appointmentDate: appointmentDate.toISOString(),
        duration: service?.duration || 60,
        price: service?.price || "0",
        notes: data.notes,
        status: "confirmed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Agendamento criado com sucesso!" });
      setOpen(false);
      setAppointmentForm({
        serviceId: "",
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        date: "",
        time: "",
        notes: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointmentForm.serviceId || !appointmentForm.clientName || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    createAppointmentMutation.mutate(appointmentForm);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Check if there are services available
  const hasServices = Array.isArray(services) && services.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Criar Agendamento</span>
          </DialogTitle>
        </DialogHeader>
        
        {servicesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-slate-600">Carregando serviços...</p>
            </div>
          </div>
        ) : servicesError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar serviços. Verifique se você configurou seu perfil de negócio.
            </AlertDescription>
          </Alert>
        ) : !hasServices ? (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você precisa criar pelo menos um serviço antes de fazer agendamentos. 
              Vá para a aba "Serviços" para criar seu primeiro serviço.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Selection */}
            <div>
              <Label htmlFor="service">Serviço *</Label>
              <Select
                value={appointmentForm.serviceId}
                onValueChange={(value) => setAppointmentForm({ ...appointmentForm, serviceId: value })}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(services) && services.map((service: any) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <span className="text-sm text-slate-500 ml-2">
                          R$ {parseFloat(service.price).toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client Information */}
            <div>
              <Label htmlFor="clientName" className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Nome do Cliente *</span>
              </Label>
              <Input
                id="clientName"
                type="text"
                value={appointmentForm.clientName}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, clientName: e.target.value })}
                required
                placeholder="Nome completo"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="clientPhone">Telefone</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={appointmentForm.clientPhone}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, clientPhone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={appointmentForm.clientEmail}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, clientEmail: e.target.value })}
                  placeholder="email@exemplo.com"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date" className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Data *</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                  min={today}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="time" className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Horário *</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                rows={3}
                placeholder="Observações adicionais sobre o agendamento..."
                className="mt-2"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={createAppointmentMutation.isPending}
              >
                {createAppointmentMutation.isPending ? "Criando..." : "Criar Agendamento"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}