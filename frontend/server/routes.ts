import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema, insertSkillSchema, insertJobSchema } from "@shared/schema";
import type { Skill, JobWithSkills, JobMatch } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "job-match-secret-key";

interface AuthRequest extends Request {
  userId?: string;
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      const userSkills = await storage.getUserSkills(user.id);

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          skills: userSkills,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      const userSkills = await storage.getUserSkills(user.id);

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          skills: userSkills,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Login failed" });
    }
  });

  // User Routes
  app.get("/api/users/profile", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userSkills = await storage.getUserSkills(user.id);

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        skills: userSkills,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get profile" });
    }
  });

  app.put("/api/users/skills", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { skillId, action } = req.body;

      if (!skillId || !action) {
        return res.status(400).json({ error: "skillId and action required" });
      }

      if (action === "add") {
        await storage.addUserSkill({ userId: req.userId!, skillId });
      } else if (action === "remove") {
        await storage.removeUserSkill(req.userId!, skillId);
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }

      const userSkills = await storage.getUserSkills(req.userId!);
      res.json({ skills: userSkills });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update skills" });
    }
  });

  // Skills Routes
  app.get("/api/skills", async (_req, res) => {
    try {
      const skills = await storage.getAllSkills();
      res.json(skills);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const data = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(data);
      res.json(skill);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create skill" });
    }
  });

  // Jobs Routes
  app.get("/api/jobs", async (_req, res) => {
    try {
      const allJobs = await storage.getAllJobs();
      const jobsWithSkills: JobWithSkills[] = await Promise.all(
        allJobs.map(async (job) => {
          const skills = await storage.getJobSkills(job.id);
          return { ...job, skills };
        })
      );
      res.json(jobsWithSkills);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const skills = await storage.getJobSkills(job.id);
      res.json({ ...job, skills });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const data = insertJobSchema.parse(req.body);
      const job = await storage.createJob(data);
      res.json(job);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create job" });
    }
  });

  // Matching Routes
  app.get("/api/matching/jobs", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userSkills = await storage.getUserSkills(req.userId!);
      const userSkillIds = new Set(userSkills.map(s => s.id));
      
      const allJobs = await storage.getAllJobs();
      const matches: JobMatch[] = await Promise.all(
        allJobs.map(async (job) => {
          const jobSkillsList = await storage.getJobSkills(job.id);
          const matchedSkills = jobSkillsList.filter(s => userSkillIds.has(s.id));
          const matchPercentage = jobSkillsList.length > 0 
            ? Math.round((matchedSkills.length / jobSkillsList.length) * 100)
            : 0;
          
          return {
            ...job,
            skills: jobSkillsList,
            matchedSkills,
            matchPercentage,
          };
        })
      );

      matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get matches" });
    }
  });

  return httpServer;
}
