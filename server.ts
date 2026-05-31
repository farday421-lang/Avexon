import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable large JSON body parsing to support passing the full current state
app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client server-side securely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API endpoint for AI content updates
app.post("/api/gemini/update", async (req, res): Promise<any> => {
  try {
    if (!ai) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server. Please add it in Settings > Secrets.",
      });
    }

    const { instruction, currentState } = req.body;

    if (!instruction || !currentState) {
      return res.status(400).json({
        success: false,
        error: "Missing instruction or currentState in request body.",
      });
    }

    const systemPrompt = `You are an expert full-stack web administrator for the Avexon Digital Agency platform.
Your task is to update or modify the website content based on the user's natural language request (instruction).
You will receive the 'currentState' which is the current content of the website. Your output MUST be the modified 'updatedSections' in the specified JSON structure.

Guidelines:
1. Understand the instruction (can be in Bengali, English, or mixed Banglish).
2. Spot which sections need to be updated. The fields can be:
   - 'hero': HomePage headline, subtitle, ctaText, whatsappNumber.
   - 'owner': Owner profile name, role, title, picUrl.
   - 'headerBranding': logo/branding text, branding badge, subtitles, etc.
   - 'noticeConfig': notices array or show status, notice items have id, iconName (e.g. Megaphone, Sparkles, Flame, ShieldCheck, HeartHandshake, Clock), text, badge, and optional highlight text.
   - 'offerConfig': Mega banner configs. (badgeText, urgencyText, descriptionText, timerType: "midnight"|"custom_target", customTargetDate, discountActive: boolean, discountPercentage: number).
   - 'services': Services lists. (id, title, icon, description, price, originalPrice, badge).
   - 'websites': Ready-made websites product catalog. (id, title, image, price, originalPrice, category, features: array of strings, demoLink).
   - 'portfolio': Past work portfolio. (id, title, image, category, tags: array of strings, link, description).
   - 'testimonials': Client reviews. (id, feedback, name, role, company, avatar, rating: number 1-5).
   - 'team': Agency staff members. (id, name, role, image, fbLink, githubLink, whatsapp).

3. Handling Collections (services, websites, portfolio, testimonials, team):
   - EDIT: Match by 'id' or search for a matching 'title' or 'name' of the item. Update fields within that item. Always preserve unchanged items in the array.
   - ADD: Construct a new object with a unique random ID (e.g. 'pkg-99' or auto-generate) and append it to the specific array. Make sure you set realistic/appropriate default fields for not-specified parameters.
   - DELETE: Remove the item matching the visual key or name from the array.

4. Formulate an elegant feedback message in Bengali explanatory text for the 'explanation' property.
5. If the request is unrelated or you can't satisfy it, keep current states unchanged but write details in 'explanation'.
`;

    const userPrompt = `
Instruction: "${instruction}"

Current State (currentState):
${JSON.stringify(currentState, null, 2)}
`;

    // Make Gemini structured generation call
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1, // low temperature for precise updates
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["explanation"],
          properties: {
            updatedSections: {
              type: Type.OBJECT,
              description: "Only include sections we want to update. Exclude any unchanged section keys completely.",
              properties: {
                hero: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    ctaText: { type: Type.STRING },
                    whatsappNumber: { type: Type.STRING },
                  },
                },
                owner: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    title: { type: Type.STRING },
                    picUrl: { type: Type.STRING },
                  },
                },
                headerBranding: {
                  type: Type.OBJECT,
                  properties: {
                    brandName: { type: Type.STRING },
                    brandBadge: { type: Type.STRING },
                    brandSubtitle: { type: Type.STRING },
                    fontFamily: { type: Type.STRING },
                    googleFontUrl: { type: Type.STRING },
                  },
                },
                noticeConfig: {
                  type: Type.OBJECT,
                  properties: {
                    show: { type: Type.BOOLEAN },
                    notices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          iconName: { type: Type.STRING },
                          text: { type: Type.STRING },
                          badge: { type: Type.STRING },
                          highlight: { type: Type.STRING },
                        },
                      },
                    },
                  },
                },
                offerConfig: {
                  type: Type.OBJECT,
                  properties: {
                    show: { type: Type.BOOLEAN },
                    badgeText: { type: Type.STRING },
                    urgencyText: { type: Type.STRING },
                    descriptionText: { type: Type.STRING },
                    timerType: { type: Type.STRING, description: "Must be Either 'midnight' or 'custom_target'" },
                    customTargetDate: { type: Type.STRING },
                    discountActive: { type: Type.BOOLEAN },
                    discountPercentage: { type: Type.INTEGER },
                  },
                },
                services: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      icon: { type: Type.STRING },
                      description: { type: Type.STRING },
                      price: { type: Type.INTEGER },
                      originalPrice: { type: Type.INTEGER },
                      badge: { type: Type.STRING },
                    },
                  },
                },
                websites: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      image: { type: Type.STRING },
                      price: { type: Type.INTEGER },
                      originalPrice: { type: Type.INTEGER },
                      category: { type: Type.STRING },
                      demoLink: { type: Type.STRING },
                      features: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                  },
                },
                portfolio: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      image: { type: Type.STRING },
                      category: { type: Type.STRING },
                      link: { type: Type.STRING },
                      description: { type: Type.STRING },
                      tags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                  },
                },
                testimonials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      company: { type: Type.STRING },
                      feedback: { type: Type.STRING },
                      rating: { type: Type.INTEGER },
                      avatar: { type: Type.STRING },
                    },
                  },
                },
                team: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      image: { type: Type.STRING },
                      fbLink: { type: Type.STRING },
                      githubLink: { type: Type.STRING },
                      whatsapp: { type: Type.STRING },
                    },
                  },
                },
              },
            },
            explanation: {
              type: Type.STRING,
              description: "A friendly message in Bengali explaining what was changed and why.",
            },
          },
        },
      },
    });

    const resultText = response.text || "{}";
    const parsedResult = JSON.parse(resultText);

    res.json({
      success: true,
      ...parsedResult,
    });
  } catch (error: any) {
    console.error("Error running Gemini Content Modifier AI:", error);
    
    let userMessage = error.message || "An error occurred while generating update parameters with Gemini API.";
    const errStr = typeof error === 'object' ? JSON.stringify(error) : String(error);
    
    if (errStr.includes("leaked") || userMessage.includes("leaked")) {
      userMessage = "আপনার Gemini API Key-টি লিকেজ (leaked) হওয়ার কারণে Google কর্তৃক ব্লক করা হয়েছে। অনুগ্রহ করে নতুন একটি Gemini API Key সংগ্রহ করুন এবং AI Studio-র ডানদিকের গিয়ার (Settings) আইকন থেকে Secrets প্যানেলে গিয়ে 'GEMINI_API_KEY' কি-টি আপডেট করুন।";
    } else if (errStr.includes("PERMISSION_DENIED") || userMessage.includes("PERMISSION_DENIED")) {
      userMessage = "Gemini API অ্যাক্সেস প্রত্যাখ্যান করা হয়েছে (Permission Denied)। অনুগ্রহ করে নিশ্চিত করুন যে Settings > Secrets-এ আপনার GEMINI_API_KEY ভ্যালুটি সঠিক ও সচল রয়েছে।";
    }
    
    res.status(500).json({
      success: false,
      error: userMessage,
    });
  }
});

// JSON File DB Database Paths
const CONTENT_DB_FILE = path.join(process.cwd(), "content_db.json");
const ORDERS_DB_FILE = path.join(process.cwd(), "orders_db.json");

// API to get content config from sever JSON file
app.get("/api/content", (req, res) => {
  try {
    if (fs.existsSync(CONTENT_DB_FILE)) {
      const fileData = fs.readFileSync(CONTENT_DB_FILE, "utf-8");
      res.json({ success: true, data: JSON.parse(fileData) });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (err: any) {
    console.error("Error reading content database:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to save content config to server JSON file
app.post("/api/content", (req, res) => {
  try {
    const updatedContent = req.body;
    fs.writeFileSync(CONTENT_DB_FILE, JSON.stringify(updatedContent, null, 2), "utf-8");
    res.json({ success: true, message: "Content updated successfully on the server!" });
  } catch (err: any) {
    console.error("Error writing content database:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to get all customer orders
app.get("/api/orders", (req, res) => {
  try {
    if (fs.existsSync(ORDERS_DB_FILE)) {
      const fileData = fs.readFileSync(ORDERS_DB_FILE, "utf-8");
      res.json({ success: true, data: JSON.parse(fileData) });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (err: any) {
    console.error("Error reading orders database:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to add or update an order in server JSON file
app.post("/api/orders", (req, res) => {
  try {
    const incomingOrder = req.body;
    let ordersList = [];

    if (fs.existsSync(ORDERS_DB_FILE)) {
      const fileData = fs.readFileSync(ORDERS_DB_FILE, "utf-8");
      try {
        ordersList = JSON.parse(fileData);
      } catch (err) {
        ordersList = [];
      }
    }

    const existingIndex = ordersList.findIndex((o: any) => o.id === incomingOrder.id);
    if (existingIndex !== -1) {
      ordersList[existingIndex] = { ...ordersList[existingIndex], ...incomingOrder };
    } else {
      ordersList.push(incomingOrder);
    }

    fs.writeFileSync(ORDERS_DB_FILE, JSON.stringify(ordersList, null, 2), "utf-8");
    res.json({ success: true, data: ordersList });
  } catch (err: any) {
    console.error("Error writing orders database:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to delete an order from server JSON file
app.delete("/api/orders/:id", (req, res) => {
  try {
    const orderId = req.params.id;
    let ordersList = [];

    if (fs.existsSync(ORDERS_DB_FILE)) {
      const fileData = fs.readFileSync(ORDERS_DB_FILE, "utf-8");
      try {
        ordersList = JSON.parse(fileData);
      } catch (err) {
        ordersList = [];
      }
    }

    ordersList = ordersList.filter((o: any) => o.id !== orderId);
    fs.writeFileSync(ORDERS_DB_FILE, JSON.stringify(ordersList, null, 2), "utf-8");
    res.json({ success: true, data: ordersList });
  } catch (err: any) {
    console.error("Error deleting order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Setup development dev-server or production asset handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static build configuration loaded.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();
