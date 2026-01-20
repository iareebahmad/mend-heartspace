import { motion } from "framer-motion";

interface AIMirrorProps {
  reflection: string;
  emotionalState: number;
}

export function AIMirror({ reflection, emotionalState }: AIMirrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground/60">
          A gentle reflection
        </span>
      </div>
      
      <div className="bg-muted/30 rounded-3xl p-6 border border-border/30">
        <p className="text-foreground font-serif text-lg leading-relaxed text-center">
          "{reflection}"
        </p>
      </div>
      
      <p className="text-center text-muted-foreground/60 text-xs">
        This is an observation, not advice. You know yourself best.
      </p>
    </motion.div>
  );
}
