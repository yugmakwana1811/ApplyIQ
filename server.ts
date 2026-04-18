import express from "express";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer";
// @ts-ignore
import pdf from "pdf-parse";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

// Extend Request type for Multer
interface MulterRequest extends express.Request {
  file?: any;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- AUTH ROUTES ---
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || "SEEKER",
          profile: role === "SEEKER" ? { create: {} } : undefined,
          recruiter: role === "RECRUITER" ? { create: {} } : undefined,
        },
      });
      res.json({ id: user.id, email: user.email, role: user.role });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true, recruiter: true },
      });
      if (!user) return res.status(404).json({ error: "User not found" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Invalid password" });

      res.json({ id: user.id, email: user.email, role: user.role, profileId: user.profile?.id, recruiterId: user.recruiter?.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- PROFILE ROUTES ---
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: req.params.userId },
        include: { resume: true },
      });
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/profile/:userId", async (req, res) => {
    try {
      const { name, headline, bio, skills, education, experience, projects, achievements } = req.body;
      const profile = await prisma.profile.update({
        where: { userId: req.params.userId },
        data: {
          name,
          headline,
          bio,
          skills: JSON.stringify(skills),
          education: JSON.stringify(education),
          experience: JSON.stringify(experience),
          projects: JSON.stringify(projects),
          achievements: JSON.stringify(achievements),
        },
      });
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- RESUME ROUTES ---
  app.post("/api/resume/upload", upload.single("resume"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const { profileId } = req.body;

      let content = "";
      if (req.file.mimetype === "application/pdf") {
        const data = await pdf(req.file.buffer);
        content = data.text;
      } else {
        content = req.file.buffer.toString();
      }

      const resume = await prisma.resume.upsert({
        where: { profileId },
        update: { content },
        create: { profileId, content },
      });

      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- JOB ROUTES ---
  app.get("/api/jobs", async (req, res) => {
    try {
      const { query, category } = req.query;
      const jobs = await prisma.job.findMany({
        where: {
          OR: query ? [
            { title: { contains: query as string } },
            { description: { contains: query as string } },
          ] : undefined,
          category: category ? (category as string) : undefined,
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const { title, company, description, requirements, location, salary, type, category, recruiterId } = req.body;
      const job = await prisma.job.create({
        data: { title, company, description, requirements, location, salary, type, category, recruiterId },
      });
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- APPLICATION ROUTES ---
  app.post("/api/applications", async (req, res) => {
    try {
      const { userId, jobId, coverLetter } = req.body;
      const application = await prisma.application.create({
        data: { userId, jobId, coverLetter },
      });
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/applications/:userId", async (req, res) => {
    try {
      const applications = await prisma.application.findMany({
        where: { userId: req.params.userId },
        include: { job: true },
      });
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- MATCHES ---
  app.get("/api/matches/:userId", async (req, res) => {
    try {
      const matches = await prisma.match.findMany({
        where: { userId: req.params.userId },
        include: { job: true },
        orderBy: { score: "desc" },
      });
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- SAVED JOBS ---
  app.post("/api/saved-jobs", async (req, res) => {
    try {
      const { userId, jobId } = req.body;
      const existing = await prisma.savedJob.findUnique({
        where: { userId_jobId: { userId, jobId } }
      });
      if (existing) {
        await prisma.savedJob.delete({
          where: { id: existing.id }
        });
        res.json({ saved: false });
      } else {
        await prisma.savedJob.create({
          data: { userId, jobId }
        });
        res.json({ saved: true });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saved-jobs/:userId", async (req, res) => {
    try {
      const savedJobs = await prisma.savedJob.findMany({
        where: { userId: req.params.userId },
        include: { job: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(savedJobs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Seed sample jobs if empty
    const jobCount = await prisma.job.count();
    if (jobCount === 0) {
      await prisma.job.createMany({
        data: [
          { title: "Senior Full Stack Engineer", company: "GlobalTech Solutions", description: "Looking for an expert in React, Node.js and distributed systems to lead our core platform team.", category: "Engineering", type: "FULL_TIME", location: "San Francisco / Remote", salary: "$140k - $180k" },
          { title: "Product Designer", company: "CreativeFlow", description: "Design intuitive interfaces for our next-generation creative tools. Proficiency in Figma and motion design required.", category: "Design", type: "FULL_TIME", location: "Brooklyn, NY / Remote", salary: "$110k - $150k" },
          { title: "AI Research Intern", company: "NeuralMind Labs", description: "Great opportunity for grad students to work on cutting-edge LLM alignment and evaluation pipelines.", category: "Engineering", type: "INTERNSHIP", location: "Palo Alto, CA", salary: "$45/hr" },
          { title: "Growth Marketing Manager", company: "SaaS Launchpad", description: "Help us scale our user base to 1M+ using data-driven experimentation and performance marketing.", category: "Marketing", type: "FULL_TIME", location: "Remote", salary: "$90k - $130k" }
        ]
      });
      console.log("Sample jobs seeded.");
    }
  });
}

startServer();
