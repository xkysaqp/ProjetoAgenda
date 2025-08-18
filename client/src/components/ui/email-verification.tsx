import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, RefreshCw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmailVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  email: string;
  userId: string;
  userName: string;
}

export function EmailVerification({ isOpen, onClose, onVerified, email, userId, userName }: EmailVerificationProps) {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleVerify = async () => {
    if (!code.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Digite o código de verificação",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/verify-email", { email, code });
      
      toast({
        title: "Email verificado!",
        description: "Sua conta foi confirmada com sucesso",
      });
      
      onVerified();
    } catch (error: any) {
      setAttempts(prev => prev + 1);
      toast({
        title: "Erro na verificação",
        description: error.message || "Código incorreto ou expirado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await apiRequest("POST", "/api/auth/resend-verification", { userId, email, name: userName });
      
      toast({
        title: "Código reenviado!",
        description: "Verifique seu email novamente",
      });
      
      setCode("");
      setAttempts(0);
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar",
        description: error.message || "Tente novamente em alguns minutos",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verificar Email</CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Código de Verificação</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Código de 6 dígitos
            </p>
          </div>

          {attempts > 0 && (
            <div className="text-center">
              <Badge variant="destructive">
                Tentativas: {attempts}/3
              </Badge>
              {attempts >= 3 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Muitas tentativas. Reenvie o código.
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={isLoading || !code.trim() || attempts >= 3}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verificar Email
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Reenviar Código
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          </div>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Não recebeu o email?</p>
            <p>Verifique sua pasta de spam ou clique em "Reenviar Código"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


