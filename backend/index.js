import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import chatbotRoutes from "./routes/chatbot.route.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 4002;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      
    ],
    methods: ["GET", "POST"],
  })
);


mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.log(" MongoDB Error:", err));


app.use("/api/v1/chat", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully!");
});


app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
