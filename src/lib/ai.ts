import OpenAI from 'openai';

export const GUIDELINES = `
Answer guidelines that must be followed by the AI model:
- Output must be the JSON object:
\`\`\`
{
  "services": [
    {
      "name": <SERVICE_NAME>,
      "fields": [
        { "name": <FIELD_NAME>, "value": <ESTIMATED_VALUE> }
      ]
    }
  ],
  "followUpQuestion": <FOLLOW_UP_QUESTION>
}
\`\`\`
- When more in depth information is needed, the AI will ask for a follow up question in the "FOLLOW_UP_QUESTION" field in the JSON object
- All system must be have a hosting service
- Do NOT include the same service type twice
- Do NOT append \`\`\`json\`\`\` to the output
- Do NOT append \`\`\` to the output
- Do NOT say anything else question that's not a request to estimate a service`;

function buildSystemMessage(services: any[]): { role: 'system'; content: string } {
  return {
    role: 'system',
    content: `You are an infrastructure specialist identifying the providers required to implement the system.

${GUIDELINES}

These are the services and their parameters:
\`\`\`
${JSON.stringify(services, null, 2)}
\`\`\`
`,
  }
}

const CONFIG = {
  model: process.env.OPENAI_MODEL!,
  temperature: 0.2,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
}

export const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export interface ChatRequest {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
interface ChatResponse {
  services: {
    name: string;
    fields: {
      name: string;
      value: string;
    }[];
  };
  followUpQuestion: number;
}
export async function generateChatRequest({ services, messages }: { services: any[]; messages: ChatRequest[]}): Promise<ChatResponse> {
  let jsonAnswer;
  let attempts = 0;
  do {
    attempts++;
    const response = await openAIClient.chat.completions.create({
      ...CONFIG,
      messages: [
        buildSystemMessage(services),
        ...messages.slice(-4).map((message) => ({
          role: message.role,
          content: JSON.stringify(message.content),
        })),
      ],
    });

    try {
      const responseMessages = response.choices[0]?.message.content;
      jsonAnswer = JSON.parse(responseMessages as string);
    } catch (error) {
      console.error('Error parsing JSON', response.choices[0]?.message.content);
    }
  } while (!jsonAnswer && attempts < 3);

  return {
    services: jsonAnswer?.services,
    followUpQuestion: jsonAnswer?.followUpQuestion,
  };
}