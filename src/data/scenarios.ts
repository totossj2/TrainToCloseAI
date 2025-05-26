export const scenarios = [
  {
    id: 1,
    title: "Software Demo Call",
    description: "Demonstrate your SaaS product to a potential customer who has concerns about implementation time and cost.",
    difficulty: "intermediate" as const,
    category: "SaaS",
    userRole: "Sales Representative",
    aiRole: "Potential Customer (IT Director)",
    initialPrompt: "Hi there! I'm interested in your CRM solution, but I'm concerned about the implementation time and how it will affect our operations."
  },
  {
    id: 2,
    title: "Enterprise Solution Pitch",
    description: "Present your enterprise security solution to a company that recently experienced a data breach.",
    difficulty: "advanced" as const,
    category: "Security",
    userRole: "Account Executive",
    aiRole: "Chief Information Security Officer",
    initialPrompt: "We're evaluating several security solutions after our recent incident. Why should we choose your product over the competitors?"
  },
  {
    id: 3,
    title: "Product Upgrade Conversation",
    description: "Convince an existing customer to upgrade to your premium tier with new features.",
    difficulty: "beginner" as const,
    category: "Upselling",
    userRole: "Customer Success Manager",
    aiRole: "Current Customer (Marketing Manager)",
    initialPrompt: "I'm pretty happy with our current plan, but I'm curious about what the premium version offers."
  },
  {
    id: 4,
    title: "Healthcare Solution Presentation",
    description: "Present your healthcare management software to a medical practice looking to modernize their systems.",
    difficulty: "intermediate" as const,
    category: "Healthcare",
    userRole: "Healthcare Solutions Specialist",
    aiRole: "Medical Practice Manager",
    initialPrompt: "We're still using paper records and basic scheduling software. How would your solution help us transition to a fully digital system?"
  },
  {
    id: 5,
    title: "Handling Difficult Price Objections",
    description: "Navigate a conversation with a prospect who finds your solution too expensive compared to competitors.",
    difficulty: "advanced" as const,
    category: "Objection Handling",
    userRole: "Sales Representative",
    aiRole: "Skeptical Prospect (CFO)",
    initialPrompt: "I've reviewed your proposal and frankly, it's 30% more expensive than other options we're considering. Why should we pay this premium?"
  },
  {
    id: 6,
    title: "Contract Renewal Discussion",
    description: "Convince a client to renew their annual contract despite experiencing some service issues.",
    difficulty: "expert" as const,
    category: "Retention",
    userRole: "Account Manager",
    aiRole: "Dissatisfied Client (Operations Director)",
    initialPrompt: "Given the problems we've had this year, I'm not sure we want to renew our contract. We're evaluating other options."
  },
  {
    id: 7,
    title: "Financial Services Consultation",
    description: "Present investment options to a high-net-worth individual looking for portfolio diversification.",
    difficulty: "advanced" as const,
    category: "Financial Services",
    userRole: "Financial Advisor",
    aiRole: "Wealthy Investor",
    initialPrompt: "I've done well with my tech investments, but I'm looking to diversify. What options can you recommend that balance growth and security?"
  },
  {
    id: 8,
    title: "Manufacturing Equipment Sale",
    description: "Sell industrial equipment to a manufacturing company looking to increase production efficiency.",
    difficulty: "intermediate" as const,
    category: "Manufacturing",
    userRole: "Industrial Equipment Sales Specialist",
    aiRole: "Production Manager",
    initialPrompt: "We need to increase our production capacity by at least 25% while reducing energy costs. What solutions can you offer?"
  }
];