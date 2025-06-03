import * as readline from "readline";
import { simulateInteractiveSalesConversation } from "../utils/chatgpt";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Get product description from command line arguments
const product = process.argv[2];

if (!product) {
  console.log(
    "Please provide a product description as a command line argument."
  );
  console.log("Example: npm run start:sales 'CRM Software'");
  process.exit(1);
}

// Start the conversation
simulateInteractiveSalesConversation(product, rl)
  .catch((error) => {
    console.error("Error running sales conversation:", error);
  })
  .finally(() => {
    rl.close();
  });
