import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

interface ReflectivePromptProps {
  prompt: string;
  value: string;
  onChange: (value: string) => void;
}

export function ReflectivePrompt({ prompt, value, onChange }: ReflectivePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <p className="text-center text-foreground font-serif text-xl leading-relaxed">
        {prompt}
      </p>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write freely, or skip if you'd prefer..."
        className="min-h-[140px] bg-muted/30 border-border/50 rounded-2xl resize-none 
          focus:ring-2 focus:ring-primary/20 focus:border-primary/30 
          placeholder:text-muted-foreground/50 text-foreground leading-relaxed p-4"
      />
      
      <p className="text-center text-muted-foreground/60 text-xs">
        This is just for you. No one else will see this.
      </p>
    </motion.div>
  );
}
