import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ========================= 1. Takes paramter in the url itself ====================================

// Endpoint: GET /api/mindmap/:topic
// app.get("/api/mindmap/:topic", async (req, res) => {
//   const topic = req.params.topic;

//   if (!topic) {
//     return res.status(400).json({ error: "Topic is required" });
//   }

//   try {
//     const prompt = `Create the ultimate, extremely detailed yet easy-to-understand and user-friendly roadmap for "${topic}" as a hierarchical mind map in JSON format.
//     - Include at least 3 levels: main topic, subtopics, sub-subtopics, and key actionable points.
//     - Cover all essential concepts, skills, tools, and practical steps needed to master the topic.
//     - Organize the roadmap logically and progressively, from beginner to advanced.
//     - Use clear, simple language for each point.
//     - Structure the JSON like this:
//     {
//       "topic": "TOPIC",
//       "subtopics": [
//         {
//           "title": "Subtopic 1",
//           "children": [
//             {
//               "title": "Sub-subtopic 1",
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

// // Call Ollama's local API
// const ollamaResponse = await axios.post(
//   "http://localhost:11434/api/generate",
//   {
//     model: "llama3",
//     prompt,
//     stream: false,
//   }
// );

// const aiReply = ollamaResponse.data.response;

// // Try to extract JSON from the AI's response
// const jsonStart = aiReply.indexOf("{");
// const jsonEnd = aiReply.lastIndexOf("}") + 1;
// const jsonString = aiReply.slice(jsonStart, jsonEnd);

// const jsonData = JSON.parse(jsonString);

// res.json(jsonData);
// } catch (err) {
//   res.status(500).json({
//     error: "Failed to generate mind map",
//     message: err.message,
//   });
// }
// });

// app.listen(PORT, () => {
//   console.log(`🧠 Mind Map API is running at http://localhost:${PORT}`);
// });

// ========================= 2. Takes raw json body as parameter ====================================
// // Endpoint: POST /api/mindmap
// app.post("/api/mindmap", async (req, res) => {
//   const { topic } = req.body;

//   if (!topic) {
//     return res.status(400).json({ error: "Topic is required" });
//   }

//   try {
//     const prompt = `Create the ultimate, extremely detailed yet easy-to-understand and user-friendly roadmap for "${topic}" as a hierarchical mind map in JSON format.
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

//     // Call Ollama's local API
//     const ollamaResponse = await axios.post(
//       "http://localhost:11434/api/generate",
//       {
//         model: "llama3",
//         prompt,
//         stream: false,
//       }
//     );

//     const aiReply = ollamaResponse.data.response;

//     // Try to extract JSON from the AI's response
//     const jsonStart = aiReply.indexOf("{");
//     const jsonEnd = aiReply.lastIndexOf("}") + 1;
//     const jsonString = aiReply.slice(jsonStart, jsonEnd);

//     const jsonData = JSON.parse(jsonString);

//     res.json(jsonData);
//   } catch (err) {
//     res.status(500).json({
//       error: "Failed to generate mind map",
//       message: err.message,
//     });
//   }
// });

// ========================= 3. Using GEMINI API Takes raw json body as parameter ====================================

app.get("/api/mindmap/:topic", async (req, res) => {
  const topic = req.params.topic;

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
