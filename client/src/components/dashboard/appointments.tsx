import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, X, Check, Calendar, Filter, Search } from "lucide-react";
import CreateAppointment from "./create-appointment";

export default function Appointments() {
  const { toast } = useToast();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Status do agendamento atualizado!" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar agendamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pendente", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
      completed: { label: "Concluído", variant: "outline" as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getClientInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "??";
  };

  if (isLoading) {
    return <div>Carregando agendamentos...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Agendamentos</h1>
          <p className="text-slate-600">Gerencie todos os seus agendamentos.</p>
        </div>
        <div className="flex items-center space-x-4">
          <CreateAppointment />
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" className="w-40" />
        </div>
      </div>

      {/* Appointments List */}
      {Array.isArray(appointments) && appointments.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-600">
                <div className="col-span-3">Cliente</div>
                <div className="col-span-3">Serviço</div>
                <div className="col-span-2">Data/Hora</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Ações</div>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {appointments.map((appointment: any) => (
                <div key={appointment.id} className="px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {getClientInitials(appointment.clientName)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{appointment.clientName}</p>
                          <p className="text-sm text-slate-600">{appointment.clientPhone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <p className="font-medium text-slate-900">Serviço Agendado</p>
                      <p className="text-sm text-slate-600">
                        {appointment.duration} min • R$ {parseFloat(appointment.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium text-slate-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-slate-600">
                        {new Date(appointment.appointmentDate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="col-span-2">
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        {appointment.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateAppointmentMutation.mutate({
                                id: appointment.id,
                                status: "confirmed",
                              })
                            }
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateAppointmentMutation.mutate({
                              id: appointment.id,
                              status: "cancelled",
                            })
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-slate-600">
              Os agendamentos aparecerão aqui quando os clientes começarem a agendar serviços.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
