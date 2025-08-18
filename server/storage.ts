import {
  users,
  providers,
  services,
  availability,
  dateBlocks,
  appointments,
  verificationCodes,
  type User,
  type Provider,
  type Service,
  type Availability,
  type DateBlock,
  type Appointment,
  type InsertUser,
  type InsertProvider,
  type InsertService,
  type InsertAvailability,
  type InsertDateBlock,
  type InsertAppointment,
  type InsertVerificationCode,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  markUserAsVerified(userId: string): Promise<void>;
  
  // Verification operations
  createVerificationCode(code: InsertVerificationCode): Promise<void>;
  getVerificationCodeByEmail(email: string): Promise<any>;
  markVerificationCodeAsUsed(id: string): Promise<void>;
  invalidateVerificationCodes(userId: string): Promise<void>;
  
  // Provider operations
  getProvider(id: string): Promise<Provider | undefined>;
  getProviderByUserId(userId: string): Promise<Provider | undefined>;
  getProviderBySlug(slug: string): Promise<Provider | undefined>;
  createProvider(provider: InsertProvider): Promise<Provider>;
  updateProvider(id: string, provider: Partial<InsertProvider>): Promise<Provider>;
  
  // Service operations
  getServices(providerId: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;
  
  // Availability operations
  getAvailability(providerId: string): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: string, availability: Partial<InsertAvailability>): Promise<Availability>;
  deleteAvailability(id: string): Promise<void>;
  
  // Date blocks operations
  getDateBlocks(providerId: string): Promise<DateBlock[]>;
  createDateBlock(dateBlock: InsertDateBlock): Promise<DateBlock>;
  deleteeDateBlock(id: string): Promise<void>;
  
  // Appointment operations
  getAppointments(providerId: string): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: string): Promise<void>;
  getAppointmentsByDateRange(providerId: string, startDate: Date, endDate: Date): Promise<Appointment[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    
    if (!user) {
      throw new Error('Failed to create user - no user returned from database');
    }
    
    return user;
  }

  async markUserAsVerified(userId: string): Promise<void> {
    await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId));
  }

  // Verification operations
  async createVerificationCode(code: InsertVerificationCode): Promise<void> {
    await db.insert(verificationCodes).values(code);
  }

  async getVerificationCodeByEmail(email: string): Promise<any> {
    const [code] = await db.select().from(verificationCodes).where(eq(verificationCodes.email, email));
    return code;
  }

  async markVerificationCodeAsUsed(id: string): Promise<void> {
    await db.update(verificationCodes).set({ used: true }).where(eq(verificationCodes.id, id));
  }

  async invalidateVerificationCodes(userId: string): Promise<void> {
    await db.update(verificationCodes).set({ used: true }).where(eq(verificationCodes.userId, userId));
  }

  // Provider operations
  async getProvider(id: string): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.id, id));
    return provider;
  }

  async getProviderByUserId(userId: string): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.userId, userId));
    return provider;
  }

  async getProviderBySlug(slug: string): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.slug, slug));
    return provider;
  }

  async createProvider(insertProvider: InsertProvider): Promise<Provider> {
    const [provider] = await db.insert(providers).values(insertProvider).returning();
    return provider;
  }

  async updateProvider(id: string, insertProvider: Partial<InsertProvider>): Promise<Provider> {
    const [provider] = await db
      .update(providers)
      .set({ ...insertProvider, updatedAt: new Date() })
      .where(eq(providers.id, id))
      .returning();
    return provider;
  }

  // Service operations
  async getServices(providerId: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.providerId, providerId))
      .orderBy(asc(services.createdAt));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: string, insertService: Partial<InsertService>): Promise<Service> {
    const [service] = await db
      .update(services)
      .set({ ...insertService, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Availability operations
  async getAvailability(providerId: string): Promise<Availability[]> {
    return await db
      .select()
      .from(availability)
      .where(eq(availability.providerId, providerId))
      .orderBy(asc(availability.dayOfWeek));
  }

  async createAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const [avail] = await db.insert(availability).values(insertAvailability).returning();
    return avail;
  }

  async updateAvailability(id: string, insertAvailability: Partial<InsertAvailability>): Promise<Availability> {
    const [avail] = await db
      .update(availability)
      .set(insertAvailability)
      .where(eq(availability.id, id))
      .returning();
    return avail;
  }

  async deleteAvailability(id: string): Promise<void> {
    await db.delete(availability).where(eq(availability.id, id));
  }

  // Date blocks operations
  async getDateBlocks(providerId: string): Promise<DateBlock[]> {
    return await db
      .select()
      .from(dateBlocks)
      .where(eq(dateBlocks.providerId, providerId))
      .orderBy(asc(dateBlocks.startDate));
  }

  async createDateBlock(insertDateBlock: InsertDateBlock): Promise<DateBlock> {
    const [dateBlock] = await db.insert(dateBlocks).values(insertDateBlock).returning();
    return dateBlock;
  }

  async deleteeDateBlock(id: string): Promise<void> {
    await db.delete(dateBlocks).where(eq(dateBlocks.id, id));
  }

  // Appointment operations
  async getAppointments(providerId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.providerId, providerId))
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
    return appointment;
  }

  async updateAppointment(id: string, insertAppointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set({ ...insertAppointment, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  async getAppointmentsByDateRange(providerId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.providerId, providerId),
          gte(appointments.appointmentDate, startDate),
          lte(appointments.appointmentDate, endDate)
        )
      )
      .orderBy(asc(appointments.appointmentDate));
  }
}

export const storage = new DatabaseStorage();
