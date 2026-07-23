import "dotenv/config";
import express from "express";
import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Access Denied. No Token Provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
}

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    res.json({
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).send("Invalid Password");
  }

  const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
  },
  process.env.JWT_SECRET
  );

  console.log(token);

  const { password: _, ...userData } = user;

res.status(200).json({
  message: "Login Successful",
  token: token,
  user: userData,
});
});

app.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to your profile",
    user: req.user,
  });
});

app.post("/jobs", verifyToken, async (req, res) => {
  try {
      const { company, position, status } = req.body;

      if (!company || !position || !status) {
      return res.status(400).json({
      message: "Company, position and status are required",
      });
    }

    const job = await prisma.job.create({
      data: {
        company,
        position,
        status,
        userId: req.user.id,
      },
    },);

  res.status(201).json({
    message: "Job created successfully",
    job,
  });
    

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/jobs", verifyToken, async (req, res) => {
  try {
    const { company, status } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        userId: req.user.id,

        ...(company && {
          company: {
            contains: company,
            mode: "insensitive",
          },
        }),

        ...(status && {
          status,
        }),
      },
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.put("/jobs/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, status } = req.body;

    const job = await prisma.job.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: Number(id),
      },
      data: {
        company,
        position,
        status,
      },
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.delete("/jobs/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await prisma.job.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});