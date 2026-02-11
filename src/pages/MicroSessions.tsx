import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ExpertCard } from "@/components/ui/ExpertCard";
import { Button } from "@/components/ui/button";
import { usePatternSignals } from "@/hooks/usePatternSignals";
import { useAuth } from "@/hooks/useAuth";
import { computePatternSnapshot, getThemeLabel, type PatternSnapshot } from "@/lib/patternSnapshot";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { X, Sparkles } from "lucide-react";

const experts = [
  { name: "Dr. Ananya Sharma", specialty: "Anxiety & Stress", rating: 4.9, sessionPrice: "₹399" },
  { name: "Ravi Menon", specialty: "Relationship Issues", rating: 4.8, sessionPrice: "₹349" },
  { name: "Dr. Priya Patel", specialty: "Work-Life Balance", rating: 4.9, sessionPrice: "₹449" },
  { name: "Kavitha Rajan", specialty: "Self-worth & Confidence", rating: 4.7, sessionPrice: "₹299" },
  { name: "Dr. Vikram Rao", specialty: "Anxiety & Emotional Health", rating: 4.9, sessionPrice: "₹499" },
  { name: "Meera Iyer", specialty: "Stress & Resilience", rating: 4.8, sessionPrice: "₹349" },
];

function getPatternFraming(snapshot: PatternSnapshot | null): string {
  if (!snapshot || snapshot.signalCount < 3) {
    return "This space is here whenever you feel ready.";
  }
  if (snapshot.avgIntensity >= 3.2 || snapshot.baselineState === "high" || snapshot.baselineState === "fluctuating") {
    return "We've noticed this theme showing up often in your reflections.";
  }
  if (snapshot.avgIntensity >= 2.0) {
    return "Some of your recent reflections touch on themes that may benefit from deeper conversation.";
  }
  return "This space is here whenever you feel ready.";
}

function generateReflectionSummary(snapshot: PatternSnapshot | null): string {
  if (!snapshot || snapshot.signalCount < 3) {
    return "You've been sharing your thoughts recently. Take a moment to review what feels most important before your session.";
  }

  const themes = snapshot.dominantThemes.map(t => getThemeLabel(t));
  const themePart = themes.length > 0
    ? `Your recent reflections have touched on ${themes.join(", ")}.`
    : "You've been reflecting regularly.";

  const tonePart = snapshot.baselineState === "calm"
    ? "Overall, your emotional tone has felt relatively steady."
    : snapshot.baselineState === "elevated"
    ? "There's been a gentle undercurrent of heightened feeling lately."
    : snapshot.baselineState === "fluctuating"
    ? "Your emotional landscape has been shifting — which is completely natural."
    : "There's been some intensity in what you've been processing.";

  const frequencyPart = snapshot.recentWeekCount > snapshot.priorWeekCount
    ? "You've been reflecting more often this past week."
    : "";

  return [themePart, tonePart, frequencyPart].filter(Boolean).join(" ");
}

export default function MicroSessions() {
  const { user } = useAuth();
  const [showSummary, setShowSummary] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  const { data: snapshot } = useQuery({
    queryKey: ["pattern-snapshot-sessions", user?.id],
    queryFn: () => computePatternSnapshot(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const handlePrepareSummary = () => {
    setSummaryText(generateReflectionSummary(snapshot ?? null));
    setShowSummary(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-5"
            >
              Deepen Your Reflection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed mb-3"
            >
              Sometimes it helps to sit with someone trained to listen.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-muted-foreground/70 leading-relaxed max-w-lg mx-auto"
            >
              If you ever choose to speak with a professional, your recent reflections can help guide the conversation.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pattern-Aware Framing */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-muted-foreground italic max-w-md mx-auto"
          >
            {getPatternFraming(snapshot ?? null)}
          </motion.p>
        </div>
      </section>

      {/* Reflection Summary Block */}
      <section className="pb-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Would you like to bring a short summary of your recent reflections into your session?
            </p>

            <AnimatePresence>
              {!showSummary ? (
                <motion.div key="button" exit={{ opacity: 0, scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handlePrepareSummary}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Prepare Reflection Summary
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-card rounded-2xl p-5 shadow-card text-left relative"
                >
                  <button
                    onClick={() => setShowSummary(false)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-muted-foreground mb-2">Your reflection summary — feel free to edit</p>
                  <Textarea
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    className="min-h-[100px] border-border/50 bg-background/50 text-sm leading-relaxed resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Professionals */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {experts.map((expert, index) => (
                <ExpertCard
                  key={expert.name}
                  {...expert}
                  delay={index * 0.08}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-serif font-medium text-foreground mb-4">
              Not sure where to start?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Let MEND suggest someone based on what you've been reflecting on recently.
            </p>
            <Button
              size="lg"
              className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all px-8"
            >
              Get a Suggestion
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
