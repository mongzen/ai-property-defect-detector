import { GoogleGenAI, Type } from '@google/genai';
import { Defect, UploadedImage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeImages(images: UploadedImage[]): Promise<Omit<Defect, 'id'>[]> {
  const parts = images.map((img, index) => {
    if (!img.base64Data || !img.mimeType) {
      throw new Error(`Image ${index} is missing base64 data or mimeType`);
    }
    return {
      inlineData: {
        data: img.base64Data,
        mimeType: img.mimeType,
      },
    };
  });

  const prompt = `
    You are an expert property inspector and computer vision AI.
    Analyze the provided images of a property to detect any defects or damages.
    For each defect found, provide the image index (starting from 0 for the first image),
    the category of the defect, a detailed description, the severity, a confidence score (0-100),
    and a recommended action to fix it.
    
    If no defects are found in an image, do not return any defects for that image.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: {
      parts: [...parts, { text: prompt }],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            imageIndex: {
              type: Type.INTEGER,
              description: 'The index of the image where the defect was found (0-based).',
            },
            category: {
              type: Type.STRING,
              description: 'The category of the defect.',
              enum: [
                'Wall Cracks',
                'Water Leakage',
                'Flooring Issues',
                'Paint Peeling',
                'Mold/Mildew',
                'Fixture Damage',
                'Other',
              ],
            },
            description: {
              type: Type.STRING,
              description: 'Detailed description of the defect.',
            },
            severity: {
              type: Type.STRING,
              description: 'Severity of the defect.',
              enum: ['Low', 'Medium', 'High'],
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Confidence score of the detection (0-100).',
            },
            recommendedAction: {
              type: Type.STRING,
              description: 'Recommended action to fix the defect.',
            },
          },
          required: [
            'imageIndex',
            'category',
            'description',
            'severity',
            'confidenceScore',
            'recommendedAction',
          ],
        },
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No response from Gemini');
  }

  try {
    const defects = JSON.parse(text);
    return defects;
  } catch (error) {
    console.error('Failed to parse JSON response:', text);
    throw new Error('Invalid JSON response from Gemini');
  }
}
