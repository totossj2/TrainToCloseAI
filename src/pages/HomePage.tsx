import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  BarChart3,
  MessageSquare,
  Award,
  Brain,
  Target,
  Clock,
  Sparkles,
  X,
  ChevronUpIcon,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import "../styles/audioWaves.css";

import { useMemo } from "react";
import { Disclosure, Transition } from "@headlessui/react";
const conversationFlow = [
  {
    ai: "Honestly? We've tried tools like this before. They look shiny in demos, but zero traction with my team.",
    user: "I hear you. That's exactly why we embedded it *inside* HubSpot — no extra clicks, zero friction. And our success team doesn't just hand off the tool — they coach your team until it sticks.",
  },
  {
    ai: "Even if my team uses it, I'm fighting to cut budgets. $10K? That's a hard no right now.",
    user: "Totally get it. But here's the thing — it's not spending more, it's investing smart. Our clients *routinely* unlock $3K–$5K in monthly productivity gains. Plus, if you don't see results in 30 days, you don't pay. No risk.",
  },
  {
    ai: "ROI sounds nice, but how do I *really* prove it's working?",
    user: "Perfect question. We co-create your success metrics from day one — deal velocity, rep activity, hours saved. We set the baseline, then track progress biweekly. No guesswork, just hard data.",
  },
  {
    ai: "Alright, I'm listening. What's the next move if I'm in?",
    user: "Let's make it happen. I'll send you a quick onboarding form, your dedicated success manager will take over setup, and you'll start seeing impact in week one. Want me to share real stories from teams just like yours?",
  },
];

const AudioWaves = ({ disabled = false }: { disabled?: boolean }) => {
  const bars = useMemo(() => {
    return [...Array(10)].map((_, i) => {
      const height = 12 + (i % 5) * 2; // alturas predecibles
      const duration = 1 + (i % 4) * 0.1; // animaciones suavemente distintas
      const delay = i * 0.1; // stagger uniforme
      return { height, duration, delay };
    });
  }, []);

  return (
    <div className="flex items-center gap-1">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="w-2 bg-teal-400 rounded-full opacity-75 transition-all duration-300"
          style={{
            height: disabled ? "8px" : `${bar.height}px`,
            animation: disabled
              ? "none"
              : `audioWave ${bar.duration}s ease-in-out infinite`,
            animationDelay: disabled ? "0s" : `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const HomePage = () => {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversationIndex, setConversationIndex] = useState(1);
  const [messages, setMessages] = useState([
    { isAi: true, message: conversationFlow[0].ai },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [initialSequenceComplete, setInitialSequenceComplete] = useState(false);
  const [isWaitingAiResponse, setIsWaitingAiResponse] = useState(false);
  const headlines = [
    { highlight: "Sell Better. Handle any objection" },
    { highlight: "Sell Better. Train like you sell" },
    { highlight: "Sell Better. Talk like a closer" },
    { highlight: "Sell Better. Get sharp, fast" },
    { highlight: "Sell Better. Close the tough ones" },
  ];

  const faqs = [
    {
      question: "Who is this for?",
      answer:
        "This is for closers, SDRs, and founders who want to improve their sales performance through high-quality roleplay and feedback.",
    },
    {
      question: "Is the AI actually realistic?",
      answer:
        "Yes. The AI is trained to simulate real objections, emotional responses, and challenging buyers — so you can practice under pressure.",
    },
    {
      question: "Do I need to pay to join the waitlist?",
      answer:
        "Nope. Joining the waitlist is 100% free. No credit card required. You'll get early access and potential discounts at launch.",
    },
    {
      question: "How long are the training sessions?",
      answer:
        "Most roleplays last between 15-20 minutes. You can train on-demand whenever you want, without scheduling anything.",
    },
    {
      question: "What happens after I join?",
      answer:
        "You'll receive email updates, be notified when we launch, and possibly get invited to early beta access if you're among the first.",
    },
    {
      question: "Can I use this if I'm new to sales?",
      answer:
        "Absolutely. Whether you're a beginner or a pro, repetition + feedback is the fastest way to level up your closing skills.",
    },
  ];
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setHeadlineIndex((current) => (current + 1) % headlines.length);
        setIsTransitioning(false);
      }, 500);
    }, 4500);

    // Add initial sequence timing
    let userTimeout: NodeJS.Timeout;
    let aiTimeout: NodeJS.Timeout;

    if (!initialSequenceComplete) {
      // After 2 seconds, show user's first response
      userTimeout = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { isAi: false, message: conversationFlow[0].user },
        ]);
        setIsWaitingAiResponse(true);
        // After another 2 seconds, show AI's second message
        aiTimeout = setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { isAi: true, message: conversationFlow[1].ai },
          ]);
          setInitialSequenceComplete(true);
          setConversationIndex(1);
          setIsWaitingAiResponse(false);
        }, 2000);
      }, 2000);
    }

    return () => {
      // Disable smooth scrolling when component unmounts
      document.documentElement.style.scrollBehavior = "auto";
      clearInterval(interval);
      // Clear timeouts to prevent duplicate messages
      if (userTimeout) clearTimeout(userTimeout);
      if (aiTimeout) clearTimeout(aiTimeout);
    };
  }, [initialSequenceComplete]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email: waitlistEmail }]);

      if (error) throw error;

      toast.success(
        "You've successfully joined the waitlist! We'll be in touch soon."
      );
      setWaitlistEmail("");
    } catch (err) {
      console.error("Error joining waitlist:", err);
      toast.error(
        "Unable to join the waitlist at this time. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSendMessage = () => {
    if (conversationIndex >= conversationFlow.length) return;

    setIsSending(true);
    setIsWaitingAiResponse(true);

    // Add user's message
    setMessages((prev) => [
      ...prev,
      {
        isAi: false,
        message: conversationFlow[conversationIndex].user,
      },
    ]);

    // Scroll to show user's message
    setTimeout(scrollToBottom, 100);

    // Simulate typing delay for AI response
    setTimeout(() => {
      if (conversationIndex + 1 < conversationFlow.length) {
        setMessages((prev) => [
          ...prev,
          {
            isAi: true,
            message: conversationFlow[conversationIndex + 1].ai,
          },
        ]);
        // Scroll to show AI's message
        setTimeout(scrollToBottom, 100);
      }
      setConversationIndex((prev) => prev + 1);
      setIsSending(false);
      setIsWaitingAiResponse(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        id="hero"
        className="pt-32 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <div className="inline-block px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 font-semibold text-sm mb-6">
                🚀 Launching Soon
              </div>
              <div className="relative h-[150px]">
                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight `}
                >
                  <span className="text-white z-10 absolute">Sell Better.</span>{" "}
                  <span
                    className={`text-teal-400 headline-transition ${
                      isTransitioning ? "headline-inactive" : "headline-active"
                    }`}
                  >
                    {headlines[headlineIndex].highlight}
                  </span>
                </h1>
              </div>
              <p className="text-xl text-gray-200 mb-8 animate-fadeInDelay">
                <span className="text-white">
                  Real conversations. Real pressure. Real results.
                </span>
                <br />
                Train with <span className="text-teal-400">AI</span> that talks
                like your
                <span className="text-teal-400"> toughest prospect</span> — and
                learn to
                <span className="text-teal-400"> win them over</span>.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    const element = document.getElementById("waitlist");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-3 rounded-lg bg-white text-gray-900 font-medium text-center hover:bg-teal-500 hover:text-white transition-colors duration-300 shadow-lg hover:shadow-xl transform animate-fadeInDelay2"
                >
                  Get the Edge — Join Early Access
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end animate-fadeInRight">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl transform rotate-6 opacity-30 blur-xl"></div>
                <div className="relative bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 ">
                  <div className="p-3 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-gray-400 text-xs">
                        Train To Close
                      </div>
                    </div>

                    <div
                      ref={chatContainerRef}
                      className="space-y-4 h-[450px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                      style={{
                        scrollBehavior: "smooth",
                        overscrollBehavior: "contain",
                      }}
                    >
                      {messages.map((msg, idx) => (
                        <ChatBubble
                          key={idx}
                          isAi={msg.isAi}
                          message={msg.message}
                        />
                      ))}
                    </div>
                    {conversationIndex < conversationFlow.length && (
                      <div className="flex justify-between md:justify-center mt-4 ">
                        <div className="w-full justify-between md:w-fit px-4 py-2 mx-auto bg-teal-900/30 rounded-full text-teal-400 text-sm font-medium flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Mic className="w-6 h-6" />
                            <AudioWaves
                              disabled={isSending || isWaitingAiResponse}
                            />
                          </div>
                          <span
                            onClick={
                              !initialSequenceComplete
                                ? undefined
                                : handleSendMessage
                            }
                            className={`text-white px-4 py-2 rounded-full ${
                              isSending || !initialSequenceComplete
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer bg-teal-500 hover:bg-teal-600 transition-colors duration-300"
                            }`}
                            style={{
                              pointerEvents:
                                isSending || !initialSequenceComplete
                                  ? "none"
                                  : "auto",
                            }}
                          >
                            {isSending ? "Sending..." : "Send"}
                          </span>
                        </div>
                      </div>
                    )}
                    {conversationIndex >= conversationFlow.length && (
                      <div className="text-center md:gap-1 px-4 py-2 mt-4 h-[52px] flex items-center justify-center bg-teal-900/30 text-white rounded-lg">
                        Deal closed! Now{" "}
                        <span className="cursor-pointer underline text-teal-400 font-medium hover:text-teal-500">
                          break down the feedback
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Problem Section */}
      <section id="problem" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-red-500 bg-red-900/30 px-4 py-1 w-fit mx-auto font-semibold mb-2 block relative">
              <span className="bg-red-900 w-1 h-full absolute top-0 left-0"></span>
              THE PROBLEM
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Most sales training is <span className="text-red-500">fake</span>,
              <span className="text-red-500"> slow</span>, and
              <span className="text-red-500">
                {" "}
                completely disconnected
              </span>{" "}
              from reality.
            </h2>
            <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
              You're rehearsing lines in a safe room, but the real world doesn't
              play nice. The pressure is real. And it exposes every gap you
              didn't train for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProblemCard
              title="You're unprepared when it matters"
              description="Role-plays don't simulate real stakes. So when the real objections hit, you're guessing instead of executing."
            />
            <ProblemCard
              title="You lose deals — and confidence"
              description="Every missed close chips away at your momentum. You start second-guessing. You hesitate. You lose your edge."
            />
            <ProblemCard
              title="The pressure breaks you, not your pitch"
              description="Practice doesn't replicate pressure. But pressure is the only thing that reveals if you're actually ready."
            />
          </div>

          <div className="text-center mt-16">
            <p className="text-xl text-red-400 font-semibold italic">
              You only get one shot. Most reps are blowing it.
            </p>
          </div>
        </div>
      </section>

      {/* Transformation Section - How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Train Smarter. Close Faster.
            </h2>
            <p className="text-xl text-gray-300">
              Forget theory. Here's how real improvement happens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Choose Your Battle"
              description="Pick a product or scenario that matches your real-world sales challenges."
            />
            <StepCard
              number="2"
              title="Face the AI Prospect"
              description="Jump into a live roleplay call with an AI trained to challenge you like your toughest leads."
            />
            <StepCard
              number="3"
              title="Get Precise Feedback"
              description="Receive actionable insights on how you handled objections, built trust, and drove urgency."
            />
          </div>

          <div className="mt-16 text-center max-w-2xl mx-auto">
            <p className="italic text-lg text-teal-400">
              "Repetition builds confidence. Feedback builds skill. Combine
              both, and you become unstoppable."
            </p>
          </div>
        </div>
      </section>
      {/* Waitlist Section */}
      <section
        id="waitlist"
        className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      >
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Train like a top closer — before anyone else
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Get exclusive early access to the AI-powered platform that helps you
            sharpen your pitch, crush objections, and close with confidence.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Your best email"
                required
                className="flex-grow px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Join the Waitlist"}
              </button>
            </div>
          </form>

          <div className="text-sm text-gray-400 mb-12">
            Early access spots are limited. Don't miss out.
          </div>

          <p className="text-xs text-gray-500 mt-8">
            No spam. You can unsubscribe anytime.
          </p>
        </div>
      </section>

      <section id="faq" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Disclosure key={i}>
                {({ open }) => (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <Disclosure.Button className="flex justify-between items-center w-full text-left text-white text-lg font-medium">
                      <span>{faq.question}</span>
                      <ChevronUpIcon
                        className={`w-5 h-5 text-teal-400 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-200 ease-out"
                      enterFrom="transform scale-y-95 opacity-0"
                      enterTo="transform scale-y-100 opacity-100"
                      leave="transition duration-150 ease-out"
                      leaveFrom="transform scale-y-100 opacity-100"
                      leaveTo="transform scale-y-95 opacity-0"
                    >
                      <Disclosure.Panel
                        static
                        className="mt-2 text-gray-300 text-sm origin-top"
                      >
                        {faq.answer}
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ChatBubble = ({ isAi, message }: { isAi: boolean; message: string }) => (
  <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
    <div
      className={`max-w-xs sm:max-w-sm rounded-xl px-4 py-3 animate-messageIn ${
        isAi ? "bg-gray-700 text-gray-100" : "bg-teal-500 text-white"
      }`}
    >
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

const ProblemCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
      <span className="text-red-500">
        <X className="w-4 h-4" />
      </span>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
    <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const StepCard = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative">
    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-white mb-3 mt-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const BenefitCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default HomePage;
