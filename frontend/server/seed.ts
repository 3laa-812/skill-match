import { db } from "./db";
import { skills, jobs, jobSkills } from "@shared/schema";
import { sql } from "drizzle-orm";

const skillsData = [
  { name: "JavaScript", category: "Programming" },
  { name: "TypeScript", category: "Programming" },
  { name: "React", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Programming" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Git", category: "Tools" },
  { name: "CSS", category: "Frontend" },
  { name: "HTML", category: "Frontend" },
  { name: "GraphQL", category: "API" },
  { name: "REST API", category: "API" },
  { name: "Next.js", category: "Frontend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "Express.js", category: "Backend" },
  { name: "Java", category: "Programming" },
  { name: "C++", category: "Programming" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "Redis", category: "Database" },
  { name: "Linux", category: "Systems" },
  { name: "Agile", category: "Methodology" },
];

const jobsData = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    description: "We're looking for an experienced frontend developer to lead our UI/UX initiatives. You'll work with modern frameworks and collaborate with cross-functional teams to build exceptional user experiences.",
    salary: "$120,000 - $160,000",
    jobType: "full-time",
    remote: true,
    requiredSkills: ["React", "TypeScript", "CSS", "Git"]
  },
  {
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    description: "Join our fast-growing startup as a full stack engineer. You'll be responsible for building and maintaining our core platform using modern web technologies.",
    salary: "$100,000 - $140,000",
    jobType: "full-time",
    remote: true,
    requiredSkills: ["JavaScript", "Node.js", "React", "PostgreSQL", "Docker"]
  },
  {
    title: "Backend Developer",
    company: "DataFlow Inc",
    location: "Austin, TX",
    description: "We need a skilled backend developer to design and implement scalable APIs. Experience with microservices architecture is a plus.",
    salary: "$110,000 - $150,000",
    jobType: "full-time",
    remote: false,
    requiredSkills: ["Node.js", "PostgreSQL", "REST API", "Docker", "AWS"]
  },
  {
    title: "DevOps Engineer",
    company: "CloudNine",
    location: "Seattle, WA",
    description: "Help us build and maintain our cloud infrastructure. You'll be working with cutting-edge technologies to ensure high availability and performance.",
    salary: "$130,000 - $170,000",
    jobType: "full-time",
    remote: true,
    requiredSkills: ["AWS", "Docker", "Kubernetes", "Linux", "Git"]
  },
  {
    title: "Junior Web Developer",
    company: "WebAgency",
    location: "Remote",
    description: "Great opportunity for someone starting their career in web development. You'll learn from senior developers while contributing to real projects.",
    salary: "$60,000 - $80,000",
    jobType: "full-time",
    remote: true,
    requiredSkills: ["HTML", "CSS", "JavaScript", "Git"]
  },
  {
    title: "React Native Developer",
    company: "MobileFirst",
    location: "Los Angeles, CA",
    description: "Build cross-platform mobile applications using React Native. Join our mobile team to create innovative apps used by millions.",
    salary: "$105,000 - $135,000",
    jobType: "full-time",
    remote: true,
    requiredSkills: ["React", "JavaScript", "TypeScript", "Git"]
  },
  {
    title: "Python Developer",
    company: "AI Solutions",
    location: "Boston, MA",
    description: "Work on machine learning and data processing pipelines. Strong Python skills required along with experience in data analysis.",
    salary: "$115,000 - $155,000",
    jobType: "full-time",
    remote: false,
    requiredSkills: ["Python", "PostgreSQL", "Docker", "Git"]
  },
  {
    title: "Frontend Intern",
    company: "TechStart",
    location: "Remote",
    description: "Learn and grow with our frontend team. This internship offers hands-on experience with modern web development practices.",
    salary: "$25/hour",
    jobType: "internship",
    remote: true,
    requiredSkills: ["HTML", "CSS", "JavaScript"]
  },
];

async function seed() {
  console.log("Seeding database...");
  
  // Clear existing data
  await db.delete(jobSkills);
  await db.delete(jobs);
  await db.delete(skills);
  
  // Insert skills
  const insertedSkills = await db.insert(skills).values(skillsData).returning();
  console.log(`Inserted ${insertedSkills.length} skills`);
  
  // Create skill name to id map
  const skillMap = new Map(insertedSkills.map(s => [s.name, s.id]));
  
  // Insert jobs and their skills
  for (const jobData of jobsData) {
    const { requiredSkills, ...job } = jobData;
    const [insertedJob] = await db.insert(jobs).values(job).returning();
    
    // Insert job skills
    for (const skillName of requiredSkills) {
      const skillId = skillMap.get(skillName);
      if (skillId) {
        await db.insert(jobSkills).values({ jobId: insertedJob.id, skillId, required: true });
      }
    }
  }
  
  console.log(`Inserted ${jobsData.length} jobs with skills`);
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
