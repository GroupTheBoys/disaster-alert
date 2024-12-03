// lib/groq-client.ts
import { Groq } from 'groq-sdk';

// Define the ChatCompletionMessageParam type if not using a separate types file
// This step is optional if you've already defined it in types.d.ts

// import { ChatCompletionMessageParam } from 'groq-sdk'; // Removed since it's not exported

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Import the type from your types file if needed
// If TypeScript recognizes it globally, no need to import
// Otherwise, you might need to import it like so:
// import { ChatCompletionMessageParam } from '../types';

export async function generateResponse(
  prompt: string, 
  language: 'en' | 'sw',
  imageBase64?: string
): Promise<string> {
  try {
    // System prompt for multilingual support
    const systemPrompt = language === 'sw' 
      ? "Wewe ni msaidizi anayeongea Kiswahili sanifu. Jibu maswali yote kwa Kiswahili."
      : "You are a helpful assistant. Respond in English.";

    // Define messages with explicit typing
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt
      }
    ];

    // If image is provided, include it in the user message using Markdown
    if (imageBase64) {
      const userContent = `${prompt}\n![Image](data:image/jpeg;base64,${imageBase64})`;

      messages.push({
        role: "user",
        content: userContent
      });

      const completion = await groq.chat.completions.create({
        model: "llama-3-2-90b-vision-preview",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      });

      return completion.choices[0]?.message?.content || '';
    }

    // Text-only completion
    messages.push({
      role: "user",
      content: prompt
    });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: false
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}
