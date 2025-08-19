import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, TrendingUp, DollarSign, Star, Plus } from "lucide-react";
import CreateAppointment from "./create-appointment";

interface OverviewProps {
  user: any;
  provider: any;
}

export default function Overview({ user, provider }: OverviewProps) {
  const { data: appointments } = useQuery({
    queryKey: ["/api/appointments"],
  });

  // Calculate stats from appointments
  const today = new Date();
  const appointmentsList = Array.isArray(appointments) ? appointments : [];
  
  // today's appointments count
  const todayAppointments = appointmentsList.filter((apt: any) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate.toDateString() === today.toDateString();
  }).length || 0;

  // weekly appointments
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  const weekAppointments = appointmentsList.filter((apt: any) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= thisWeekStart;
  }).length || 0;

  // monthly revenue calc
  const thisMonthRevenue = appointmentsList.filter((apt: any) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate.getMonth() === today.getMonth() && 
           aptDate.getFullYear() === today.getFullYear() &&
           apt.status === 'completed';
  }).reduce((sum: number, apt: any) => sum + parseFloat(apt.price), 0) || 0;

  // recent 5 appointments
  const recentAppointments = appointmentsList.slice(0, 5) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-slate-600">Aqui está um resumo do seu negócio hoje.</p>
        </div>
        <CreateAppointment />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-emerald-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{todayAppointments}</h3>
            <p className="text-slate-600 text-sm">Agendamentos Hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-emerald-600 font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{weekAppointments}</h3>
            <p className="text-slate-600 text-sm">Esta Semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-emerald-600 font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              R$ {thisMonthRevenue.toFixed(2)}
            </h3>
            <p className="text-slate-600 text-sm">Receita do Mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-emerald-600 font-medium">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">4.8</h3>
            <p className="text-slate-600 text-sm">Avaliação Média</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Agendamentos Recentes</h2>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </div>
        
        {recentAppointments.length > 0 ? (
          <div className="space-y-3">
            {recentAppointments.map((apt: any, index: number) => (
              <div key={apt.id || index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{apt.clientName || 'Cliente'}</p>
                    <p className="text-sm text-slate-600">{apt.serviceName || 'Serviço'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">
                    {new Date(apt.appointmentDate).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-slate-600">{apt.appointmentTime || '10:00'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">Nenhum agendamento ainda</p>
            <p className="text-sm text-slate-500">Crie seu primeiro agendamento acima</p>
          </div>
        )}
      </div>
    </div>
  );
}
