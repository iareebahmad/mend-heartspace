import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EmotionalTemperature } from "./EmotionalTemperature";
import { ReflectivePrompt } from "./ReflectivePrompt";
import { AIMirror } from "./AIMirror";
import { MicroAction } from "./MicroAction";
import { ArrowRight, Check } from "lucide-react";

type Step = "temperature" | "prompt" | "mirror" | "action" | "complete";

const prompts = [
  "What's weighing on your mind today?",
  "What would feel like a small win today?",
  "What do you need more of right now?",
  "What are you carrying that isn't yours to hold?",
  "What would you tell a friend feeling this way?",
];

const getReflection = (emotionalState: number, response: string): string => {
  const reflections: Record<number, string[]> = {
    1: [
      "It sounds like you're moving through something heavy. That takes real strength.",
      "Some days carry more weight than others. You're still here, still trying.",
      "Heavy moments are part of the journey. They don't define where you're going.",
    ],
    2: [
      "It seems like today has a quiet heaviness to it. That's okay to acknowledge.",
      "Low energy days are your mind asking for gentleness.",
      "You're noticing how you feel. That awareness is already something meaningful.",
    ],
    3: [
      "You're in a steady place today. There's wisdom in neutral moments.",
      "Not every day needs to be remarkable. Sometimes just being is enough.",
      "Neutral can be a form of peace. You're giving yourself room to just exist.",
    ],
    4: [
      "There's a quiet calm in you today. That's worth noticing.",
      "You're carrying something lighter today. Let yourself enjoy that.",
      "Calm days are worth savoring. You've earned this moment of ease.",
    ],
    5: [
      "You're feeling light today. What a gift to give yourself.",
      "There's an openness in how you're approaching today. Beautiful.",
      "Light moments remind us what we're capable of feeling. Hold onto this.",
    ],
  };
  
  const stateReflections = reflections[emotionalState] || reflections[3];
  return stateReflections[Math.floor(Math.random() * stateReflections.length)];
};

const getMicroAction = (emotionalState: number) => {
  const actions: Record<number, { title: string; description: string; duration: string }> = {
    1: {
      title: "Three conscious breaths",
      description: "Place your hand on your chest. Take three slow breaths, feeling each one move through you.",
      duration: "~1 minute",
    },
    2: {
      title: "Step outside briefly",
      description: "If possible, step outside for just a moment. Look up at the sky. Feel the air.",
      duration: "~2 minutes",
    },
    3: {
      title: "A moment of stillness",
      description: "Close your eyes for a moment. Notice five sounds around you without labeling them.",
      duration: "~2 minutes",
    },
    4: {
      title: "Carry this feeling forward",
      description: "Write down one thing you're grateful for right now. Keep it simple.",
      duration: "~1 minute",
    },
    5: {
      title: "Share your light",
      description: "Send a brief message to someone you care about. Just to say hello.",
      duration: "~2 minutes",
    },
  };
  
  return actions[emotionalState] || actions[3];
};

export function CheckInFlow() {
  const [step, setStep] = useState<Step>("temperature");
  const [emotionalState, setEmotionalState] = useState<number | null>(null);
  const [promptResponse, setPromptResponse] = useState("");
  const [currentPrompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);

  const handleTemperatureSelect = (value: number) => {
    setEmotionalState(value);
  };

  const handleContinue = () => {
    if (step === "temperature" && emotionalState !== null) {
      setStep("prompt");
    } else if (step === "prompt") {
      setStep("mirror");
    } else if (step === "mirror") {
      setStep("action");
    } else if (step === "action") {
      setStep("complete");
    }
  };

  const handleSkip = () => {
    if (step === "prompt") {
      setStep("mirror");
    } else if (step === "action") {
      setStep("complete");
    }
  };

  const handleReset = () => {
    setStep("temperature");
    setEmotionalState(null);
    setPromptResponse("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === "temperature" && (
          <motion.div
            key="temperature"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-8 border border-border/50 shadow-card space-y-8"
          >
            <EmotionalTemperature 
              value={emotionalState} 
              onChange={handleTemperatureSelect} 
            />
            
            <Button
              onClick={handleContinue}
              disabled={emotionalState === null}
              className="w-full rounded-2xl h-12 bg-primary/90 hover:bg-primary text-primary-foreground 
                disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-8 border border-border/50 shadow-card space-y-6"
          >
            <ReflectivePrompt
              prompt={currentPrompt}
              value={promptResponse}
              onChange={setPromptResponse}
            />
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleContinue}
                className="w-full rounded-2xl h-12 bg-primary/90 hover:bg-primary text-primary-foreground"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="w-full rounded-2xl h-12 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                Skip this step
              </Button>
            </div>
          </motion.div>
        )}

        {step === "mirror" && emotionalState !== null && (
          <motion.div
            key="mirror"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-8 border border-border/50 shadow-card space-y-6"
          >
            <AIMirror 
              reflection={getReflection(emotionalState, promptResponse)}
              emotionalState={emotionalState}
            />
            
            <Button
              onClick={handleContinue}
              className="w-full rounded-2xl h-12 bg-primary/90 hover:bg-primary text-primary-foreground"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === "action" && emotionalState !== null && (
          <motion.div
            key="action"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-8 border border-border/50 shadow-card"
          >
            <MicroAction 
              action={getMicroAction(emotionalState)}
              onAccept={handleContinue}
              onSkip={handleSkip}
            />
          </motion.div>
        )}

        {step === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-8 border border-border/50 shadow-card text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto"
            >
              <Check className="w-8 h-8 text-primary" />
            </motion.div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-foreground">
                Check-in complete
              </h3>
              <p className="text-muted-foreground">
                You've taken a moment for yourself today. That matters.
              </p>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              Start another check-in
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {["temperature", "prompt", "mirror", "action", "complete"].map((s, i) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              s === step 
                ? 'bg-primary w-6' 
                : ["temperature", "prompt", "mirror", "action", "complete"].indexOf(step) > i
                  ? 'bg-primary/40'
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
