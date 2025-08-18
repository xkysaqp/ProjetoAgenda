import sgMail from '@sendgrid/mail';

// Configurar SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@agendafacil.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static isConfigured(): boolean {
    return !!SENDGRID_API_KEY;
  }

  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.isConfigured()) {
        console.log('📧 SendGrid não configurado, simulando envio...');
        console.log(`Para: ${emailData.to}`);
        console.log(`Assunto: ${emailData.subject}`);
        console.log(`Conteúdo: ${emailData.text || emailData.html}`);
        return true;
      }

      const msg = {
        to: emailData.to,
        from: FROM_EMAIL,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
      };

      await sgMail.send(msg);
      console.log(`✅ Email enviado com sucesso para ${emailData.to}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  static async sendVerificationEmail(email: string, code: string, userName: string): Promise<boolean> {
    const subject = 'Confirme seu email - AgendaFácil';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">AgendaFácil</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Confirme sua conta</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin: 0 0 20px 0;">Olá, ${userName}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Obrigado por se cadastrar no AgendaFácil! Para começar a usar sua conta, 
            confirme seu email usando o código abaixo:
          </p>
          
          <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Código de verificação</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>Importante:</strong> Este código expira em 15 minutos.
          </p>
          
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <p style="color: #155724; margin: 0; font-size: 14px;">
              💡 <strong>Dica:</strong> Se você não solicitou este cadastro, 
              pode ignorar este email com segurança.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px; font-size: 14px;">
            Com o AgendaFácil, você pode gerenciar seus agendamentos de forma simples e eficiente.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 AgendaFácil. Todos os direitos reservados.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  static async sendResendVerificationEmail(email: string, code: string, userName: string): Promise<boolean> {
    const subject = 'Novo código de verificação - AgendaFácil';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">AgendaFácil</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Novo código de verificação</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin: 0 0 20px 0;">Olá, ${userName}! 🔄</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Você solicitou um novo código de verificação para sua conta no AgendaFácil. 
            Use o código abaixo para confirmar seu email:
          </p>
          
          <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Novo código de verificação</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>Importante:</strong> Este código expira em 15 minutos.
          </p>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              ⚠️ <strong>Atenção:</strong> Se você não solicitou este novo código, 
              entre em contato conosco imediatamente.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 AgendaFácil. Todos os direitos reservados.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }
}
