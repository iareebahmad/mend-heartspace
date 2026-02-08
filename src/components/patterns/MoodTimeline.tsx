import { motion } from "framer-motion";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { EmotionalWeight } from "@/lib/emotionalWeight";

export interface MoodTimelineEntry {
  date: string;
  emotion: string;
  timeBucket: string;
  weight: EmotionalWeight;
}

interface MoodTimelineProps {
  entries: MoodTimelineEntry[];
}

// Soft color tokens for emotional weight (using design system colors)
const weightStyles: Record<EmotionalWeight, { dot: string; glow: string }> = {
  light: {
    dot: "bg-mint-300",
    glow: "shadow-[0_0_8px_rgba(134,239,172,0.4)]",
  },
  medium: {
    dot: "bg-muted-foreground/50",
    glow: "",
  },
  heavy: {
    dot: "bg-lilac-400",
    glow: "shadow-[0_0_8px_rgba(167,139,250,0.3)]",
  },
};

function getRelativeDay(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  const daysAgo = differenceInDays(new Date(), date);
  if (daysAgo <= 6) return format(date, "EEEE");
  return format(date, "MMM d");
}

function TimelineDot({ weight, index }: { weight: EmotionalWeight; index: number }) {
  const styles = weightStyles[weight];
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className="relative flex items-center justify-center"
    >
      <div 
        className={`w-3 h-3 rounded-full ${styles.dot} ${styles.glow} transition-all duration-300`}
      />
    </motion.div>
  );
}

function TimelineEntry({ entry, index, isLast }: { entry: MoodTimelineEntry; index: number; isLast: boolean }) {
  const date = new Date(entry.date);
  const relativeDay = getRelativeDay(date);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="flex items-start gap-4"
    >
      {/* Vertical line + dot */}
      <div className="flex flex-col items-center">
        <TimelineDot weight={entry.weight} index={index} />
        {!isLast && (
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.2, delay: index * 0.08 + 0.1 }}
            className="w-px h-8 bg-border/40 origin-top"
          />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 -mt-0.5 pb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground/70">
            {relativeDay}
          </span>
          <span className="text-[10px] text-muted-foreground/40">
            {entry.timeBucket}
          </span>
        </div>
        <p className="text-sm text-foreground/80 capitalize mt-0.5">
          {entry.emotion}
        </p>
      </div>
    </motion.div>
  );
}

export function MoodTimeline({ entries }: MoodTimelineProps) {
  if (entries.length === 0) return null;

  // Show max 5 entries for a gentle, uncluttered view
  const visibleEntries = entries.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="mt-10"
    >
      <h3 className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-4">
        Your recent moments
      </h3>
      
      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="space-y-0">
          {visibleEntries.map((entry, i) => (
            <TimelineEntry 
              key={`${entry.date}-${i}`} 
              entry={entry} 
              index={i}
              isLast={i === visibleEntries.length - 1}
            />
          ))}
        </div>
        
        {entries.length > 5 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[11px] text-muted-foreground/50 mt-3 pt-3 border-t border-border/30 text-center italic"
          >
            Showing your 5 most recent reflections
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
