import { randomBytes } from "crypto";
import { storage } from "./storage";
import { EmailService } from "./email-service";

interface VerificationCode {
  id: string;
  userId: string;
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
}

export async function generateVerificationCode(userId: string, email: string): Promise<string> {
  // Gerar código de 6 dígitos
  const code = randomBytes(3).toString('hex').toUpperCase().slice(0, 6);
  
  // Expirar em 15 minutos
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  
  // Salvar código no banco
  await storage.createVerificationCode({
    id: randomBytes(16).toString('hex'),
    userId,
    email,
    code,
    expiresAt,
    used: false
  });
  
  return code;
}

export async function sendVerificationEmailToUser(userId: string, email: string, userName: string): Promise<boolean> {
  try {
    const code = await generateVerificationCode(userId, email);
    return await EmailService.sendVerificationEmail(email, code, userName);
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    return false;
  }
}

export async function verifyCode(email: string, code: string): Promise<{ valid: boolean; userId?: string; message?: string }> {
  try {
    const verificationCode = await storage.getVerificationCodeByEmail(email);
    
    if (!verificationCode) {
      return { valid: false, message: "Código não encontrado" };
    }
    
    if (verificationCode.used) {
      return { valid: false, message: "Código já foi usado" };
    }
    
    if (verificationCode.expiresAt < new Date()) {
      return { valid: false, message: "Código expirado" };
    }
    
    if (verificationCode.code !== code.toUpperCase()) {
      return { valid: false, message: "Código incorreto" };
    }
    
    // Marcar código como usado
    await storage.markVerificationCodeAsUsed(verificationCode.id);
    
    // Marcar usuário como verificado
    await storage.markUserAsVerified(verificationCode.userId);
    
    return { valid: true, userId: verificationCode.userId };
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return { valid: false, message: "Erro interno do servidor" };
  }
}

export async function resendVerificationCode(userId: string, email: string, userName: string): Promise<boolean> {
  try {
    // Invalidar códigos anteriores
    await storage.invalidateVerificationCodes(userId);
    
    // Enviar novo código
    return await sendVerificationEmailToUser(userId, email, userName);
  } catch (error) {
    console.error('Erro ao reenviar código:', error);
    return false;
  }
}


