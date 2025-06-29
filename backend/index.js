import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ========================= 3. Using GEMINI API Takes raw json body as parameter ====================================

app.get("/api/mindmap/:topic", async (req, res) => {
  const topic = req.params.topic;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    // const prompt = `Create the ultimate, extremely detailed yet easy-to-understand and user-friendly roadmap for "${topic}" as a hierarchical mind map in JSON format.
    // - Include at least 3 levels: main topic, subtopics, sub-subtopics, and key actionable points.
    // - Cover all essential concepts, skills, tools, and practical steps needed to master the topic.
    // - Organize the roadmap logically and progressively, from beginner to advanced.
    // - Use clear, simple language for each point.
    // - Structure the JSON like this:
    // {
    //   "topic": "TOPIC",
    //   "subtopics": [
    //     {
    //       "title": "Subtopic 1",
    //       "children": [
    //         {
    //           "title": "Sub-subtopic 1",
    //           "children": [
    //             "Key Point 1",
    //             "Key Point 2"
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // }
    // Return only the JSON.`;

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

    // Use the correct Gemini endpoint (v1, not v1beta)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        geminiApiKey,
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
      }
    );

    // Debug: log the full Gemini response
    console.log(
      "Gemini API response:",
      JSON.stringify(geminiResponse.data, null, 2)
    );

    // Extract the AI's reply
    const aiReply =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiReply) {
      throw new Error("No valid response from Gemini API");
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
    console.error("Mindmap error:", err);
    res.status(500).json({
      error: "Failed to generate mind map",
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Mind Map API is running at http://localhost:${PORT}`);
});
