import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import chatbotRoutes from "./routes/chatbot.route.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 4002;

app.use(express.json());

// ✅ FIXED CORS COMPLETELY
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://bot-git-main-riteshkumar34s-projects.vercel.app" // ❌ last slash remove
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

// IMPORTANT: Preflight support
app.options("*", cors());

// CONNECT MONGODB
mongoose
  .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Error:", err));

// ROUTES
app.use("/api/v1/chat", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully!");
});

// START SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
