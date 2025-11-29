import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// AI Provider Configuration
const AI_PROVIDER = process.env.AI_PROVIDER || "groq"; // Options: "groq", "gemini", "cohere"
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// ========================= 3. Using GEMINI API Takes raw json body as parameter ====================================

// Helper function to retry API calls with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimitError = error.response?.status === 429;
      const isLastRetry = i === maxRetries - 1;

      if (isRateLimitError && !isLastRetry) {
        const delay = baseDelay * Math.pow(2, i); // Exponential backoff
        console.log(
          `Rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// AI Provider Functions
async function callGroqAPI(prompt) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile", // Fast and accurate
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 60000,
    }
  );

  return response.data.choices[0].message.content;
}

async function callGeminiAPI(prompt) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    },
    {
      timeout: 60000,
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

async function callCohereAPI(prompt) {
  const response = await axios.post(
    "https://api.cohere.ai/v1/generate",
    {
      model: "command",
      prompt: prompt,
      max_tokens: 4000,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 60000,
    }
  );

  return response.data.generations[0].text;
}

// Main AI call function with fallback
async function callAI(prompt) {
  const providers = [];

  // Add available providers based on API keys
  if (GROQ_API_KEY && AI_PROVIDER === "groq") providers.push({ name: "groq", fn: callGroqAPI });
  if (GEMINI_API_KEY && AI_PROVIDER === "gemini") providers.push({ name: "gemini", fn: callGeminiAPI });
  if (COHERE_API_KEY && AI_PROVIDER === "cohere") providers.push({ name: "cohere", fn: callCohereAPI });

  // Fallback order: Try all available providers
  if (GROQ_API_KEY && AI_PROVIDER !== "groq") providers.push({ name: "groq", fn: callGroqAPI });
  if (GEMINI_API_KEY && AI_PROVIDER !== "gemini") providers.push({ name: "gemini", fn: callGeminiAPI });
  if (COHERE_API_KEY && AI_PROVIDER !== "cohere") providers.push({ name: "cohere", fn: callCohereAPI });

  if (providers.length === 0) {
    throw new Error(
      "No AI provider configured. Please add GROQ_API_KEY, GEMINI_API_KEY, or COHERE_API_KEY to your .env file"
    );
  }

  let lastError;
  for (const provider of providers) {
    try {
      console.log(`🤖 Trying ${provider.name.toUpperCase()} API...`);
      const result = await retryWithBackoff(() => provider.fn(prompt), 2, 1000);
      console.log(`✅ ${provider.name.toUpperCase()} API call successful`);
      return result;
    } catch (error) {
      console.log(`❌ ${provider.name.toUpperCase()} failed:`, error.message);
      lastError = error;
      // Try next provider
    }
  }

  throw lastError || new Error("All AI providers failed");
}

app.get("/api/mindmap/:topic", async (req, res) => {
  const topic = req.params.topic;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const prompt = `Create the ultimate, extremely detailed yet easy-to-understand and user-friendly roadmap for "${topic}" as a hierarchical mind map in JSON format.
- Include at least 3 levels: main topic, subtopics, sub-subtopics, and key actionable points.
- For EVERY subtopic and sub-subtopic, you MUST add a "resources" array with at least 2 reputable links (with "title" and "url") for further learning. Do NOT skip this field, even if you have to repeat the same resources.
- The "resources" array MUST be present for every subtopic and sub-subtopic, even if you have to use the same links.
- Cover all essential concepts, skills, tools, and practical steps needed to master the topic.
- Organize the roadmap logically and progressively, from beginner to advanced.
- Use clear, simple language for each point.
- Structure the JSON like this:
{
  "topic": "TOPIC",
  "subtopics": [
    {
      "title": "Subtopic 1",
      "resources": [
        { "title": "Resource Title", "url": "https://..." }
      ],
      "children": [
        {
          "title": "Sub-subtopic 1",
          "resources": [
            { "title": "Resource Title", "url": "https://..." }
          ],
          "children": [
            "Key Point 1",
            "Key Point 2"
          ]
        }
      ]
    }
  ]
}
Return ONLY the JSON. Do NOT skip the "resources" field anywhere. If you do not know a resource, use a reputable general resource for the topic.`;

    // Call AI with automatic fallback
    const aiReply = await callAI(prompt);

    if (!aiReply) {
      throw new Error("No valid response from AI provider");
    }

    // Remove code block markers if present (Gemini sometimes returns ```json ... ```)
    let cleanedReply = aiReply.replace(/```json|```/g, "").trim();

    // Try to extract JSON from the AI's response
    const jsonStart = cleanedReply.indexOf("{");
    const jsonEnd = cleanedReply.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in Gemini response");
    }
    const jsonString = cleanedReply.slice(jsonStart, jsonEnd);

    let jsonData;
    try {
      jsonData = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "JSON string:", jsonString);
      throw new Error("Invalid JSON format from Gemini response");
    }

    res.json(jsonData);
  } catch (err) {
    console.error("❌ Mindmap error:", err.message);

    // Handle rate limit errors specifically
    if (err.response?.status === 429) {
      return res.status(429).json({
        error: "API rate limit exceeded",
        message:
          "⚠️ Your Gemini API key has reached its rate limit.\n\n" +
          "Solutions:\n" +
          "1. Wait 1-2 minutes and try again\n" +
          "2. Get a new API key at: https://makersuite.google.com/app/apikey\n" +
          "3. Check your quota at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas",
        retryAfter: 60, // Suggest retry after 60 seconds
      });
    }

    // Handle authentication errors
    if (err.response?.status === 401 || err.response?.status === 403) {
      return res.status(401).json({
        error: "Invalid API key",
        message:
          "Your Gemini API key is invalid or has been revoked. Please generate a new key at https://makersuite.google.com/app/apikey",
      });
    }

    // Handle other errors
    res.status(500).json({
      error: "Failed to generate mind map",
      message: err.message || "An unexpected error occurred",
      details: process.env.NODE_ENV === "development" ? err.response?.data : undefined,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Mind Map API is running at http://localhost:${PORT}`);
});
