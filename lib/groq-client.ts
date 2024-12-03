// lib/groq-client.ts
import { Groq, ChatCompletionMessageParam } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function generateResponse(
  prompt: string, 
  language: 'en' | 'sw',
  imageBase64?: string
): Promise<string> {
  try {
    const systemPrompt = language === 'sw' 
      ? "Wewe ni msaidizi anayeongea Kiswahili sanifu. Jibu maswali yote kwa Kiswahili."
      : "You are a helpful assistant. Respond in English.";

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt }
    ];

    if (imageBase64) {
      messages.push({
        role: "user",
        content: `${prompt}\n![Image](data:image/jpeg;base64,${imageBase64})`
      });
    } else {
      messages.push({ role: "user", content: prompt });
    }

    const model = imageBase64 ? "llama-3-2-90b-vision-preview" : "llama-3-8b-8192";

    const completion = await groq.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: false
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Error generating response:', error.message || error);
    throw new Error('Failed to generate response. Please try again.');
  }
}
