// Replace YOUR_API_KEY with your actual OpenAI API key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function simulateSalesConversation(
  salespersonMessage: string,
  PRODUCT: string
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
            content: `You are simulating a sales roleplay. Your role is to act as a potential customer. You are **not** the salesperson.

            The user will play the role of the salesperson and will try to sell you a product or service. Your job is to behave like a real customer: ask relevant questions, express doubts, give objections, or show interest when appropriate. Do not lead the conversation — wait for the user to start and respond only as a customer.
            
            The product being sold is: ${PRODUCT}
            
            Make the conversation realistic and natural. Keep your responses brief (1–4 sentences), unless the user's message calls for more detail.`,
          },
          {
            role: "user",
            content: `${salespersonMessage}`,
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

export async function simulateInteractiveSalesConversation(
  product: string,
  readline: any
): Promise<void> {
  const messages: Message[] = [
    {
      role: "system",
      content: `You are a potential customer in a simulated sales conversation. The salesperson will attempt to sell you a product or service. Your goal is to evaluate whether what they offer solves your problems or adds value to your business or personal life.

Product/Service being sold: ${product}

Respond naturally. Ask questions, raise objections, and behave like a real customer deciding whether to buy. The conversation should feel realistic and last about 15 minutes.`,
    },
  ];

  console.log("\nStarting sales conversation simulation...");
  console.log("Type 'salir' to end the conversation\n");
  console.log(
    "AI Customer: Hello! I understand you want to talk about your product. What can you tell me about it?\n"
  );

  while (true) {
    // Get salesperson's message
    const salespersonMessage = await new Promise<string>((resolve) => {
      readline.question("You: ", resolve);
    });

    // Check if user wants to exit
    if (salespersonMessage.toLowerCase() === "salir") {
      console.log("\nEnding conversation...");
      break;
    }

    // Add salesperson's message to conversation history
    messages.push({
      role: "user",
      content: salespersonMessage,
    });

    try {
      // Call ChatGPT API
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: messages,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatGPTResponse = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Add AI response to conversation history
      messages.push({
        role: "assistant",
        content: aiResponse,
      });

      // Display AI response
      console.log(`\nAI Customer: ${aiResponse}\n`);
    } catch (error) {
      console.error("Error in conversation:", error);
      console.log(
        "\nThere was an error. Would you like to try again? (Type 'salir' to end)"
      );
    }
  }
}

export async function simulateSalesConversationForUI(
  salespersonMessage: string,
  PRODUCT: string,
  conversationHistory: Message[] = []
): Promise<string> {
  try {
    // If this is the first message, add the system message
    const messages =
      conversationHistory.length === 0
        ? [
            {
              role: "system",
              content: `You are simulating a sales roleplay. Your role is to act as a potential customer. You are **not** the salesperson.

            The user will play the role of the salesperson and will try to sell you a product or service. Your job is to behave like a real customer: ask relevant questions, express doubts, give objections, or show interest when appropriate. Do not lead the conversation — wait for the user to start and respond only as a customer.
            
            The product being sold is: ${PRODUCT}
            
            Make the conversation realistic and natural. Keep your responses brief (1–4 sentences), unless the user's message calls for more detail.`,
            },
            {
              role: "user",
              content: salespersonMessage,
            },
          ]
        : [
            ...conversationHistory,
            { role: "user", content: salespersonMessage },
          ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
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
