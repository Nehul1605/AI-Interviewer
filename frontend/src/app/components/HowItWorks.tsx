import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Cpu,
  MessageSquare,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

const hrSteps = [
  {
    icon: Upload,
    title: "Upload Job Description",
    description:
      "Paste or upload your job description with required skills and qualifications.",
  },
  {
    icon: Cpu,
    title: "AI Generates Questions",
    description:
      "Our AI creates 8-12 tailored interview questions specific to your role.",
  },
  {
    icon: MessageSquare,
    title: "Candidates Respond",
    description:
      "Share the interview link. Candidates answer via text or voice.",
  },
  {
    icon: FileText,
    title: "Get Ranked Results",
    description:
      "Review comprehensive score reports and ranked candidate comparisons.",
  },
];

const candidateSteps = [
  {
    icon: Upload,
    title: "Upload Your Resume",
    description: "Upload your PDF resume and select the role you're targeting.",
  },
  {
    icon: Cpu,
    title: "AI Analyzes Your Gaps",
    description:
      "System identifies skill gaps between your resume and target role.",
  },
  {
    icon: MessageSquare,
    title: "Personalized Interview",
    description:
      "Practice with questions designed specifically for your weak areas.",
  },
  {
    icon: CheckCircle,
    title: "Improve & Retry",
    description:
      "Get detailed feedback, study recommendations, and practice again.",
  },
];

export function HowItWorks() {
  const [persona, setPersona] = useState<"hr" | "candidate">("hr");

  const steps = persona === "hr" ? hrSteps : candidateSteps;

  return (
    <section
      id="how-it-works"
      className="bg-black text-white py-24 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl mb-6">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simple workflows for hiring teams and candidates
          </p>
        </motion.div>

        {/* Persona Toggle */}
        <div className="flex flex-col items-center mb-16">
          <p className="text-gray-400 mb-6 uppercase tracking-widest text-sm">
            Who are you?
          </p>
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-full">
            <Button
              variant={"ghost"}
              onClick={() => setPersona("hr")}
              className={`rounded-full px-8 py-6 text-lg transition-all ${
                persona === "hr"
                  ? "bg-white text-black hover:bg-white hover:text-black"
                  : "text-gray-400 hover:text-white hover:bg-transparent"
              }`}
            >
              Hiring Team
            </Button>
            <Button
              variant={"ghost"}
              onClick={() => setPersona("candidate")}
              className={`rounded-full px-8 py-6 text-lg transition-all ${
                persona === "candidate"
                  ? "bg-white text-black hover:bg-white hover:text-black"
                  : "text-gray-400 hover:text-white hover:bg-transparent"
              }`}
            >
              Candidate
            </Button>
          </div>
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={persona}
              initial={{ opacity: 0, x: persona === "hr" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: persona === "hr" ? 20 : -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl mb-2">
                  {persona === "hr" ? "For Hiring Teams" : "For Candidates"}
                </h3>
                <p className="text-gray-400">
                  {persona === "hr"
                    ? "Automate your screening process in 4 simple steps"
                    : "Practice and improve with personalized feedback"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={`${persona}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm h-full hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <step.icon className="w-6 h-6" />
                        </div>
                        <span className="text-4xl text-gray-700 font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <h4 className="text-xl mb-2">{step.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
