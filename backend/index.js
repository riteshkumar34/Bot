import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import chatbotRoutes from "./routes/chatbot.route.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",               // local frontend
      "http://localhost:3000",
      "https://stresschat7.vercel.app",      // your vercel frontend (when deployed)
    ],
    methods: ["GET", "POST"],
  })
);

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Error:", err));

// ROUTES
app.use("/api/v1/chat", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully!");
});

// SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
