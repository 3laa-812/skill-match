import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

// Skills table
export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  category: text("category"),
});

// User skills junction table
export const userSkills = pgTable("user_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  skillId: varchar("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  proficiency: text("proficiency").default("intermediate"),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  salary: text("salary"),
  jobType: text("job_type").default("full-time"),
  remote: boolean("remote").default(false),
  postedAt: timestamp("posted_at").defaultNow(),
});

// Job required skills junction table
export const jobSkills = pgTable("job_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  skillId: varchar("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  required: boolean("required").default(true),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userSkills: many(userSkills),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  userSkills: many(userSkills),
  jobSkills: many(jobSkills),
}));

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
  user: one(users, {
    fields: [userSkills.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ many }) => ({
  jobSkills: many(jobSkills),
}));

export const jobSkillsRelations = relations(jobSkills, ({ one }) => ({
  job: one(jobs, {
    fields: [jobSkills.jobId],
    references: [jobs.id],
  }),
  skill: one(skills, {
    fields: [jobSkills.skillId],
    references: [skills.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertUserSkillSchema = createInsertSchema(userSkills).omit({ id: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, postedAt: true });
export const insertJobSkillSchema = createInsertSchema(jobSkills).omit({ id: true });

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = insertUserSchema.extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type UserSkill = typeof userSkills.$inferSelect;
export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type JobSkill = typeof jobSkills.$inferSelect;
export type InsertJobSkill = z.infer<typeof insertJobSkillSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Extended types for frontend
export type JobWithSkills = Job & { skills: Skill[] };
export type UserWithSkills = Omit<User, 'password'> & { skills: Skill[] };
export type JobMatch = JobWithSkills & { matchPercentage: number; matchedSkills: Skill[] };
