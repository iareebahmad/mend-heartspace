import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface GreetingCardProps {
  onStartCheckIn: () => void;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export function GreetingCard({ onStartCheckIn }: GreetingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card rounded-3xl p-10 border border-border/50 shadow-card text-center space-y-8">
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm tracking-wide">
            {getDate()}
          </p>
          <h1 className="font-serif text-3xl text-foreground">
            {getGreeting()}
          </h1>
        </div>
        
        <div className="space-y-2">
          <p className="text-muted-foreground leading-relaxed">
            Take a moment to check in with yourself.
          </p>
          <p className="text-muted-foreground/60 text-sm">
            It only takes a minute.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Button
            onClick={onStartCheckIn}
            size="lg"
            className="w-full rounded-2xl h-14 bg-primary/90 hover:bg-primary text-primary-foreground 
              shadow-soft hover:shadow-hover transition-all duration-300 text-base"
          >
            Start today's check-in
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
