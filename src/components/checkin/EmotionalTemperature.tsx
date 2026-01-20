import { motion } from "framer-motion";

interface EmotionalTemperatureProps {
  value: number | null;
  onChange: (value: number) => void;
}

const emotions = [
  { value: 1, label: "Heavy", color: "bg-muted" },
  { value: 2, label: "Low", color: "bg-muted" },
  { value: 3, label: "Neutral", color: "bg-muted" },
  { value: 4, label: "Calm", color: "bg-muted" },
  { value: 5, label: "Light", color: "bg-muted" },
];

export function EmotionalTemperature({ value, onChange }: EmotionalTemperatureProps) {
  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground text-sm">
        How are you feeling right now?
      </p>
      
      <div className="flex justify-center gap-3">
        {emotions.map((emotion, index) => (
          <motion.button
            key={emotion.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            onClick={() => onChange(emotion.value)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300
              ${value === emotion.value 
                ? 'bg-primary/15 ring-2 ring-primary/30' 
                : 'hover:bg-muted/60'
              }
            `}
          >
            <div 
              className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${value === emotion.value 
                  ? 'bg-primary/20 scale-110' 
                  : 'bg-muted'
                }
              `}
            >
              <span className="text-lg">
                {emotion.value === 1 && "😔"}
                {emotion.value === 2 && "😕"}
                {emotion.value === 3 && "😐"}
                {emotion.value === 4 && "🙂"}
                {emotion.value === 5 && "😌"}
              </span>
            </div>
            <span className={`text-xs font-medium transition-colors duration-300 ${
              value === emotion.value ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {emotion.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
