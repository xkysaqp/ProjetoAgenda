import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required?: boolean;
  }[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "profile",
    title: "Perfil Profissional",
    description: "Conte-nos sobre você e seus serviços",
    icon: <User className="w-8 h-8" />,
    fields: [
      { name: "name", label: "Nome Profissional", type: "text", placeholder: "Seu nome ou nome da empresa", required: true },
      { name: "bio", label: "Biografia", type: "textarea", placeholder: "Descreva seus serviços e experiência", required: true },
      { name: "specialties", label: "Especialidades", type: "text", placeholder: "Ex: Corte, Coloração, Tratamentos", required: true },
    ]
  },
  {
    id: "services",
    title: "Serviços Oferecidos",
    description: "Defina os serviços que você oferece",
    icon: <Calendar className="w-8 h-8" />,
    fields: [
      { name: "service1", label: "Serviço 1", type: "text", placeholder: "Ex: Corte Feminino", required: true },
      { name: "duration1", label: "Duração (min)", type: "number", placeholder: "60", required: true },
      { name: "price1", label: "Preço (R$)", type: "number", placeholder: "50.00", required: true },
    ]
  },
  {
    id: "availability",
    title: "Horários de Trabalho",
    description: "Configure sua disponibilidade semanal",
    icon: <Clock className="w-8 h-8" />,
    fields: [
      { name: "workDays", label: "Dias de Trabalho", type: "text", placeholder: "Segunda a Sexta", required: true },
      { name: "startTime", label: "Horário de Início", type: "time", placeholder: "09:00", required: true },
      { name: "endTime", label: "Horário de Fim", type: "time", placeholder: "18:00", required: true },
    ]
  },
  {
    id: "location",
    title: "Localização",
    description: "Informe onde você atende",
    icon: <MapPin className="w-8 h-8" />,
    fields: [
      { name: "address", label: "Endereço", type: "text", placeholder: "Rua, número, bairro", required: true },
      { name: "city", label: "Cidade", type: "text", placeholder: "Sua cidade", required: true },
      { name: "state", label: "Estado", type: "text", placeholder: "UF", required: true },
    ]
  }
];

interface OnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
  onSaveProgress: (data: Record<string, any>) => void;
  savedData?: Record<string, any>;
}

export function Onboarding({ isOpen, onComplete, onClose, onSaveProgress, savedData }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(savedData || {});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const currentStepData = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleInputChange = (name: string, value: string) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    // Salvar progresso automaticamente
    onSaveProgress(newData);
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
    onComplete();
  };

  const getProgressPercentage = () => {
    return ((completedSteps.size + (currentStep === onboardingSteps.length - 1 ? 1 : 0)) / onboardingSteps.length) * 100;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="relative">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                {currentStepData.icon}
              </div>
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progresso</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {onboardingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : completedSteps.has(step.id)
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {currentStepData.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex items-center space-x-2"
                >
                  <span>Salvar e Fechar</span>
                </Button>

                {isLastStep ? (
                  <Button
                    onClick={handleComplete}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Finalizar</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex items-center space-x-2"
                  >
                    <span>Próximo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
