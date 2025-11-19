import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";
import stringSimilarity from "string-similarity";
import { readFileSync } from "fs";


const botResponses = JSON.parse(
  readFileSync(new URL("../controllers/data.json", import.meta.url))
);

export const Message = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }

    
    const user = await User.create({
      sender: "user",
      text,
    });

    const normalizedText = text.toLowerCase().trim();

    const allKeys = Object.keys(botResponses);

    if (allKeys.length === 0) {
      return res.status(500).json({ error: "No bot responses available" });
    }

    const { bestMatch } = stringSimilarity.findBestMatch(
      normalizedText,
      allKeys
    );

    const bestKey = bestMatch.target;
    const similarityScore = bestMatch.rating;

    const botResponse =
      similarityScore > 0.6 && botResponses[bestKey]
        ? botResponses[bestKey]
        : "Sorry, I don't understand that!!!";

    
    const bot = await Bot.create({
      text: botResponse,
    });

    return res.status(200).json({
      userMessage: user.text,
      botMessage: bot.text,
      confidence: similarityScore.toFixed(2),
    });
  } catch (error) {
    console.log("Error in Message Controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
