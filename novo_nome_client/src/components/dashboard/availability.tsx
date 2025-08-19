import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

const WEEK_DAYS = [
  { id: 0, name: "Domingo" },
  { id: 1, name: "Segunda-feira" },
  { id: 2, name: "Terça-feira" },
  { id: 3, name: "Quarta-feira" },
  { id: 4, name: "Quinta-feira" },
  { id: 5, name: "Sexta-feira" },
  { id: 6, name: "Sábado" },
];

export default function Availability() {
  const { toast } = useToast();
  const [weeklySchedule, setWeeklySchedule] = useState(
    WEEK_DAYS.map(day => ({
      dayOfWeek: day.id,
      name: day.name,
      isEnabled: day.id >= 1 && day.id <= 5, // Mon-Fri enabled by default
      startTime: "09:00",
      endTime: "18:00",
    }))
  );

  const { data: availability } = useQuery({
    queryKey: ["/api/availability"],
  });

  const { data: dateBlocks } = useQuery({
    queryKey: ["/api/date-blocks"],
  });

  const saveAvailabilityMutation = useMutation({
    mutationFn: async (schedules: any[]) => {
      // Delete existing availability and create new ones
      const promises = schedules
        .filter(schedule => schedule.isEnabled)
        .map(schedule =>
          apiRequest("POST", "/api/availability", {
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isEnabled: true,
          })
        );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({ title: "Horários salvos com sucesso!" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar horários",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteBlockMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/date-blocks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/date-blocks"] });
      toast({ title: "Bloqueio removido com sucesso!" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover bloqueio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleScheduleChange = (dayIndex: number, field: string, value: any) => {
    setWeeklySchedule(prev =>
      prev.map((schedule, index) =>
        index === dayIndex ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const handleSave = () => {
    saveAvailabilityMutation.mutate(weeklySchedule);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Disponibilidade</h1>
        <p className="text-slate-600">Configure seus horários de funcionamento e bloqueios.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Schedule */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Horários da Semana</h2>
            <div className="space-y-4">
              {weeklySchedule.map((schedule, index) => (
                <div
                  key={schedule.dayOfWeek}
                  className={`flex items-center justify-between p-4 border border-slate-200 rounded-lg ${
                    !schedule.isEnabled ? "bg-slate-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={schedule.isEnabled}
                      onCheckedChange={(checked) =>
                        handleScheduleChange(index, "isEnabled", checked)
                      }
                    />
                    <span
                      className={`font-medium ${
                        schedule.isEnabled ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {schedule.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "startTime", e.target.value)
                      }
                      disabled={!schedule.isEnabled}
                      className="w-24"
                    />
                    <span className="text-slate-500">às</span>
                    <Input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "endTime", e.target.value)
                      }
                      disabled={!schedule.isEnabled}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={handleSave}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
              disabled={saveAvailabilityMutation.isPending}
            >
              {saveAvailabilityMutation.isPending ? "Salvando..." : "Salvar Horários"}
            </Button>
          </CardContent>
        </Card>

        {/* Date Blocks */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Bloqueios de Data</h2>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  toast({
                    title: "Funcionalidade em desenvolvimento",
                    description: "Em breve você poderá adicionar bloqueios de data.",
                  });
                }}
              >
                Adicionar Bloqueio
              </Button>
            </div>
            <div className="space-y-3">
              {Array.isArray(dateBlocks) && dateBlocks.length > 0 ? (
                dateBlocks.map((block: any) => (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{block.title}</p>
                      <p className="text-sm text-slate-600">
                        {new Date(block.startDate).toLocaleDateString('pt-BR')}
                        {block.endDate !== block.startDate &&
                          ` - ${new Date(block.endDate).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBlockMutation.mutate(block.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 text-center py-8">
                  Nenhum bloqueio de data configurado.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
