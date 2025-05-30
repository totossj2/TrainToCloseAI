// Replace YOUR_API_KEY with your actual OpenAI API key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function sendTranscriptToChatGPT(
  transcript: string
): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a sales coach analyzing a sales conversation. Provide feedback on the conversation, highlighting strengths and areas for improvement.",
          },
          {
            role: "user",
            content: `Please analyze this sales conversation transcript and provide feedback: ${transcript}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatGPTResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    throw error;
  }
}
