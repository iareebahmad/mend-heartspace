import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MicroActionProps {
  action: {
    title: string;
    description: string;
    duration: string;
  };
  onAccept: () => void;
  onSkip: () => void;
}

export function MicroAction({ action, onAccept, onSkip }: MicroActionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground/60">
          Optional micro-action
        </span>
        <p className="text-muted-foreground text-sm">
          A small step, if you'd like
        </p>
      </div>
      
      <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-soft space-y-4">
        <h3 className="font-serif text-xl text-foreground text-center">
          {action.title}
        </h3>
        <p className="text-muted-foreground text-center leading-relaxed">
          {action.description}
        </p>
        <p className="text-center text-muted-foreground/60 text-xs">
          {action.duration}
        </p>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button 
          onClick={onAccept}
          className="w-full rounded-2xl h-12 bg-primary/90 hover:bg-primary text-primary-foreground"
        >
          I'll try this
        </Button>
        <Button 
          variant="ghost" 
          onClick={onSkip}
          className="w-full rounded-2xl h-12 text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          Skip for today
        </Button>
      </div>
    </motion.div>
  );
}
