import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpertCardProps {
  name: string;
  specialty: string;
  rating: number;
  sessionPrice: string;
  imageUrl?: string;
  delay?: number;
}

export function ExpertCard({ name, specialty, rating, sessionPrice, imageUrl, delay = 0 }: ExpertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lilac-200 to-mint-200 flex items-center justify-center text-base font-medium text-foreground shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{name}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">{specialty}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              20 min
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          className="flex-1 gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all text-sm"
          size="sm"
        >
          Begin Conversation
        </Button>
        <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
          From {sessionPrice}
        </span>
      </div>
    </motion.div>
  );
}
