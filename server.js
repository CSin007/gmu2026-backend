import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/chatbot", async (req, res) => {

  try {

    const { message, context } = req.body;

    const prompt = `
You are an educational assistant.

Student question:
${message}

Context:
${context || "None"}

Explain clearly.
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Error generating response"
    });

  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

