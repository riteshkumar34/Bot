import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";
import stringSimilarity from "string-similarity";

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

    
    const botResponses = {
      "hello": "Hi, How I can help you!!",
       "Who is Ubiquity Sinha ray?":"She belongs from Kharagpur West Bengal.She has done Btech from Delhi technical Campus(2023-27) in CSE.She is a brilliant Student.",    
      "hi": "Hi, How I can help you!!",
      "hey": "Hi, How I can help you!!",
      "good morning": "Good morning! How can I assist you today?",
      "good evening": "Good evening! How are you doing?",

      "how are you": "I'm just a bot, but I'm doing great! How about you?",
      "what's up": "Not much! Just chatting with you 😄",

      "bye": "Goodbye! Have a great day.",
      "thank you": "You’re welcome!",
      "i love you": "That’s sweet! I’m here to help you anytime.",

      "what is your name": "I’m ChatBot, your virtual assistant.",
      "who are you": "I’m ChatBot, your friendly assistant.",
      "who made you": "I was created by developers to help answer your questions.",
      "where are you from": "I live in the cloud — no rent, no bills!",

      "what is python": "Python is a high-level, interpreted programming language known for simplicity and versatility.",
      "what is java": "Java is a platform-independent, object-oriented programming language.",
      "what is recursion": "Recursion is when a function calls itself to solve smaller parts of a problem.",

      "who is prime minister of india": "Narendra Modi is the Prime Minister of India since May 2014.",
      "what is g20": "The G20 (Group of Twenty) is an intergovernmental forum of 19 countries + the European Union.",

      "tell me about yourself": "This is usually the first interview question.\nStructure:\n• Start with a brief intro\n• Highlight your skills\n• Share achievements\n• Conclude with why you’re excited about this role.",

      "why should we hire you": "HR wants to see your value-add.\nEmphasize skills that match job requirements.\nShow enthusiasm and cultural fit.",

      "what is leadership": "Leadership is the ability to inspire and guide others toward achieving goals.",

      "tell me a joke": "Why don’t skeletons fight each other? They don’t have the guts!",
      "who is virat kohli": "Virat Kohli is one of India’s greatest batsmen and former captain.",
      "what is ipl": "The Indian Premier League (IPL) is a professional T20 cricket league started in 2008.",
      "Who is Nitish Kumar":"He has been the CM of Bihar from 2005 to 2025.He has been in coalition with both BJP and Congress.He is a leader of JDU and also been the railway minister in vajpayee government.",
      "who is cm of Bihar?":"Nitish Kumar last updated october 2025",
    };

    const normalizedText = text.toLowerCase().trim();

    
    const allKeys = Object.keys(botResponses);
    const bestMatch = stringSimilarity.findBestMatch(normalizedText, allKeys);
    const bestKey = bestMatch.bestMatch.target;
    const similarityScore = bestMatch.bestMatch.rating;

    
    const botResponse =
      similarityScore > 0.4
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
