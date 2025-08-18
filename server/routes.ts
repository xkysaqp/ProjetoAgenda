import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, verifyPassword, getSession, isAuthenticated } from "./auth";
import { sendVerificationEmailToUser, verifyCode, resendVerificationCode } from "./email-verification";
import { 
  insertUserSchema, 
  insertProviderSchema, 
  insertServiceSchema,
  insertAvailabilitySchema,
  insertDateBlockSchema,
  insertAppointmentSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(getSession());

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
      });

      // Verify user was created successfully
      if (!user || !user.id) {
        console.error("User creation failed - user object:", user);
        return res.status(500).json({ message: "Erro interno ao criar usuário" });
      }

      // Send verification email
      await sendVerificationEmailToUser(user.id, email, name);

      req.session.userId = user.id;
      res.json({ 
        user: { id: user.id, email: user.email, name: user.name },
        message: "Conta criada com sucesso! Verifique seu email para confirmar a conta."
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, email: user.email, name: user.name, emailVerified: user.emailVerified });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Email verification routes
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ message: "Email e código são obrigatórios" });
      }

      const result = await verifyCode(email, code);
      
      if (result.valid) {
        res.json({ 
          message: "Email verificado com sucesso!",
          userId: result.userId 
        });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Erro ao verificar email" });
    }
  });

  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { userId, email, name } = req.body;
      
      if (!userId || !email || !name) {
        return res.status(400).json({ message: "Dados incompletos" });
      }

      const success = await resendVerificationCode(userId, email, name);
      
      if (success) {
        res.json({ message: "Novo código de verificação enviado!" });
      } else {
        res.status(500).json({ message: "Erro ao reenviar código" });
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ message: "Erro ao reenviar código" });
    }
  });

  // Provider routes
  app.get('/api/provider', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      res.json(provider);
    } catch (error) {
      console.error("Get provider error:", error);
      res.status(500).json({ message: "Failed to get provider" });
    }
  });

  app.post('/api/provider', isAuthenticated, async (req, res) => {
    try {
      const providerData = insertProviderSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      const provider = await storage.createProvider(providerData);
      res.json(provider);
    } catch (error: any) {
      console.error("Create provider error:", error);
      
      // Tratar erro específico de slug duplicado
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' && error.message?.includes('slug')) {
        return res.status(409).json({ 
          message: "Este nome de URL já está em uso. Tente um nome diferente ou adicione números/letras para torná-lo único." 
        });
      }
      
      res.status(400).json({ message: "Invalid provider data" });
    }
  });

  app.put('/api/provider/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const provider = await storage.updateProvider(id, updateData);
      res.json(provider);
    } catch (error) {
      console.error("Update provider error:", error);
      res.status(400).json({ message: "Failed to update provider" });
    }
  });

  // Public provider route (for booking page)
  app.get('/api/public/provider/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const provider = await storage.getProviderBySlug(slug);
      
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      // Return public info only
      res.json({
        id: provider.id,
        businessName: provider.businessName,
        description: provider.description,
        category: provider.category,
        address: provider.address,
        phone: provider.phone,
        profileImageUrl: provider.profileImageUrl,
      });
    } catch (error) {
      console.error("Get public provider error:", error);
      res.status(500).json({ message: "Failed to get provider" });
    }
  });

  // Service routes
  app.get('/api/services', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const services = await storage.getServices(provider.id);
      res.json(services);
    } catch (error) {
      console.error("Get services error:", error);
      res.status(500).json({ message: "Failed to get services" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const serviceData = insertServiceSchema.parse({
        ...req.body,
        providerId: provider.id,
      });
      
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Create service error:", error);
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.put('/api/services/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const service = await storage.updateService(id, updateData);
      res.json(service);
    } catch (error) {
      console.error("Update service error:", error);
      res.status(400).json({ message: "Failed to update service" });
    }
  });

  app.delete('/api/services/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteService(id);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Delete service error:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Public services route (for booking page)
  app.get('/api/public/provider/:slug/services', async (req, res) => {
    try {
      const { slug } = req.params;
      const provider = await storage.getProviderBySlug(slug);
      
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const services = await storage.getServices(provider.id);
      res.json(services.filter(s => s.isActive));
    } catch (error) {
      console.error("Get public services error:", error);
      res.status(500).json({ message: "Failed to get services" });
    }
  });

  // Availability routes
  app.get('/api/availability', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const availability = await storage.getAvailability(provider.id);
      res.json(availability);
    } catch (error) {
      console.error("Get availability error:", error);
      res.status(500).json({ message: "Failed to get availability" });
    }
  });

  app.post('/api/availability', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const availabilityData = insertAvailabilitySchema.parse({
        ...req.body,
        providerId: provider.id,
      });
      
      const availability = await storage.createAvailability(availabilityData);
      res.json(availability);
    } catch (error) {
      console.error("Create availability error:", error);
      res.status(400).json({ message: "Invalid availability data" });
    }
  });

  // Date blocks routes
  app.get('/api/date-blocks', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const dateBlocks = await storage.getDateBlocks(provider.id);
      res.json(dateBlocks);
    } catch (error) {
      console.error("Get date blocks error:", error);
      res.status(500).json({ message: "Failed to get date blocks" });
    }
  });

  app.post('/api/date-blocks', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const dateBlockData = insertDateBlockSchema.parse({
        ...req.body,
        providerId: provider.id,
      });
      
      const dateBlock = await storage.createDateBlock(dateBlockData);
      res.json(dateBlock);
    } catch (error) {
      console.error("Create date block error:", error);
      res.status(400).json({ message: "Invalid date block data" });
    }
  });

  app.delete('/api/date-blocks/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteeDateBlock(id);
      res.json({ message: "Date block deleted successfully" });
    } catch (error) {
      console.error("Delete date block error:", error);
      res.status(500).json({ message: "Failed to delete date block" });
    }
  });

  // Appointment routes
  app.get('/api/appointments', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const appointments = await storage.getAppointments(provider.id);
      res.json(appointments);
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({ message: "Failed to get appointments" });
    }
  });

  app.post('/api/appointments', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.session.userId!);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        providerId: provider.id,
      });
      
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      console.error("Create appointment error:", error);
      res.status(400).json({ message: "Invalid appointment data" });
    }
  });

  // Public booking route
  app.post('/api/public/provider/:slug/book', async (req, res) => {
    try {
      const { slug } = req.params;
      const provider = await storage.getProviderBySlug(slug);
      
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        providerId: provider.id,
      });
      
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      console.error("Public booking error:", error);
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.put('/api/appointments/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const appointment = await storage.updateAppointment(id, updateData);
      res.json(appointment);
    } catch (error) {
      console.error("Update appointment error:", error);
      res.status(400).json({ message: "Failed to update appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
