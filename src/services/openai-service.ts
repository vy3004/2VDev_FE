import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface ChatCompletionsPayload {
  content: string;
}

interface OpenAIServiceResponse<T> {
  response?: T;
  error?: Error;
}

const openaiService = {
  chatCompletions: async ({
    content,
  }: ChatCompletionsPayload): Promise<OpenAIServiceResponse<any>> => {
    try {
      const response = await openai.chat.completions.create({
        messages: [{ role: "system", content }],
        model: "gpt-3.5-turbo",
      });

      return { response: response.choices[0].message.content };
    } catch (error) {
      return { error: error as Error };
    }
  },
};

export default openaiService;
