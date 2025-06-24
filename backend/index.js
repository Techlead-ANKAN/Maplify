import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Endpoint: POST /api/mindmap
app.post("/api/mindmap", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const prompt = `Create the ultimate, extremely detailed yet easy-to-understand and user-friendly roadmap for "${topic}" as a hierarchical mind map in JSON format.
- Include at least 3 levels: main topic, subtopics, sub-subtopics, and key actionable points.
- Cover all essential concepts, skills, tools, and practical steps needed to master the topic.
- Organize the roadmap logically and progressively, from beginner to advanced.
- Use clear, simple language for each point.
- Structure the JSON like this:
{
  "topic": "TOPIC",
  "subtopics": [
    {
      "title": "Subtopic 1",
      "children": [
        {
          "title": "Sub-subtopic 1",
          "children": [
            "Key Point 1",
            "Key Point 2"
          ]
        }
      ]
    }
  ]
}
Return only the JSON.`;

    // Call Ollama's local API
    const ollamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        stream: false,
      }
    );

    const aiReply = ollamaResponse.data.response;

    // Try to extract JSON from the AI's response
    const jsonStart = aiReply.indexOf("{");
    const jsonEnd = aiReply.lastIndexOf("}") + 1;
    const jsonString = aiReply.slice(jsonStart, jsonEnd);

    const jsonData = JSON.parse(jsonString);

    res.json(jsonData);
  } catch (err) {
    res.status(500).json({
      error: "Failed to generate mind map",
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Mind Map API is running at http://localhost:${PORT}`);
});