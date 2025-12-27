import { 
  users, skills, userSkills, jobs, jobSkills,
  type User, type InsertUser, type Skill, type InsertSkill,
  type UserSkill, type InsertUserSkill, type Job, type InsertJob,
  type JobSkill, type InsertJobSkill
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  
  getUserSkills(userId: string): Promise<Skill[]>;
  addUserSkill(userSkill: InsertUserSkill): Promise<UserSkill>;
  removeUserSkill(userId: string, skillId: string): Promise<void>;
  
  getAllJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  getJobSkills(jobId: string): Promise<Skill[]>;
  addJobSkill(jobSkill: InsertJobSkill): Promise<JobSkill>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllSkills(): Promise<Skill[]> {
    return db.select().from(skills);
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill || undefined;
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db.insert(skills).values(insertSkill).returning();
    return skill;
  }

  async getUserSkills(userId: string): Promise<Skill[]> {
    const result = await db
      .select({ skill: skills })
      .from(userSkills)
      .innerJoin(skills, eq(userSkills.skillId, skills.id))
      .where(eq(userSkills.userId, userId));
    return result.map(r => r.skill);
  }

  async addUserSkill(insertUserSkill: InsertUserSkill): Promise<UserSkill> {
    const existing = await db
      .select()
      .from(userSkills)
      .where(
        and(
          eq(userSkills.userId, insertUserSkill.userId),
          eq(userSkills.skillId, insertUserSkill.skillId)
        )
      );
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    const [userSkill] = await db.insert(userSkills).values(insertUserSkill).returning();
    return userSkill;
  }

  async removeUserSkill(userId: string, skillId: string): Promise<void> {
    await db.delete(userSkills).where(
      and(eq(userSkills.userId, userId), eq(userSkills.skillId, skillId))
    );
  }

  async getAllJobs(): Promise<Job[]> {
    return db.select().from(jobs);
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async getJobSkills(jobId: string): Promise<Skill[]> {
    const result = await db
      .select({ skill: skills })
      .from(jobSkills)
      .innerJoin(skills, eq(jobSkills.skillId, skills.id))
      .where(eq(jobSkills.jobId, jobId));
    return result.map(r => r.skill);
  }

  async addJobSkill(insertJobSkill: InsertJobSkill): Promise<JobSkill> {
    const [jobSkill] = await db.insert(jobSkills).values(insertJobSkill).returning();
    return jobSkill;
  }
}

export const storage = new DatabaseStorage();
