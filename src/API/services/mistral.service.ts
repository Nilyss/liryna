import { Mistral } from '@mistralai/mistralai';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

export const chatResponse = async (message: string) => {
  const response = await client.chat.complete({
    model: 'mistral-small-latest',
    messages: [{ role: 'user', content: message }],
  });
  return response.choices![0].message.content;
};
