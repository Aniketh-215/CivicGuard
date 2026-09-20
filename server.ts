import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set payload size limits to allow base64 images
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  // Initialize server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || 'MOCK_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Route for Gemini Image Analysis
  app.post('/api/analyze-image', async (req, res) => {
    try {
      const { imageBase64, description } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'Missing imageBase64 payload' });
      }

      // Check for valid API key
      if (!process.env.GEMINI_API_KEY) {
        // Fallback for demonstration when API Key is not set yet
        console.warn('GEMINI_API_KEY is not defined in the environment. Using smart mock fallback.');
        const mockCategory = description && description.toLowerCase().includes('wire') ? 'Electric Pole Damage' : 'Pothole';
        return res.json({
          category: mockCategory,
          confidence: 0.92,
          severity: 'High',
          explanation: `[Mock AI Evaluation] Based on the visual evidence, a critical anomaly is identified. The issue shows characteristics of a ${mockCategory}, which creates significant public hazard. Immediate dispatch recommended.`,
          secondaryCategory: mockCategory
        });
      }

      // Prepare image parts for Gemini 3.5 Flash
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64,
        },
      };

      const promptPart = {
        text: `You are the CivicGuard AI Vision Agent. Your task is to analyze the attached photo of a municipal or public infrastructure problem.
Optional user description of the issue: "${description || ''}".

Classify the issue into exactly one of these supported categories:
- 'Pothole'
- 'Road Crack / Road Damage'
- 'Garbage Overflow'
- 'Water Leakage'
- 'Water Pipe Burst'
- 'Broken Streetlight'
- 'Electric Pole Damage'
- 'Fallen Tree'
- 'Traffic Signal Damage'
- 'Drainage Blockage'
- 'Open Manhole'
- 'Flooded Road'
- 'Broken Footpath / Sidewalk'
- 'Damaged Road Sign'
- 'Other'

Analyze carefully. Return a JSON object with these exact keys:
1. category: string (must be exactly one of the above 15 values)
2. confidence: number (a floating point number between 0.0 and 1.0 representing your confidence in this classification)
3. severity: string (must be exactly 'Low', 'Medium', 'High', or 'Critical')
4. explanation: string (a concise, clear explanation of what is detected in the image and why this classification/severity was selected)
5. secondaryCategory: string (if the category is 'Other', specify a more specific human-friendly classification name, otherwise keep it blank or the same)

Ensure the response is valid JSON only.`,
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { parts: [imagePart, promptPart] },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              severity: { type: Type.STRING },
              explanation: { type: Type.STRING },
              secondaryCategory: { type: Type.STRING },
            },
            required: ['category', 'confidence', 'severity', 'explanation'],
          },
        }
      });

      const responseText = response.text || '{}';
      const result = JSON.parse(responseText.trim());
      res.json(result);
    } catch (error: any) {
      console.error('Gemini analysis error:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze image' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();


