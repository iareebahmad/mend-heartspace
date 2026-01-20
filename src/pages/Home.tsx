import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GreetingCard } from "@/components/checkin/GreetingCard";
import { CheckInFlow } from "@/components/checkin/CheckInFlow";

export default function Home() {
  const [checkInStarted, setCheckInStarted] = useState(false);

  return (
    <Layout>
      {/* Main Check-In Section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
        <div className="w-full">
          {!checkInStarted ? (
            <GreetingCard onStartCheckIn={() => setCheckInStarted(true)} />
          ) : (
            <CheckInFlow />
          )}
        </div>
      </section>

      {/* Subtle footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center pb-8"
      >
        <p className="text-muted-foreground/50 text-xs">
          Your reflections are private and never shared.
        </p>
        <Link 
          to="/patterns" 
          className="text-muted-foreground/60 text-xs hover:text-muted-foreground transition-colors"
        >
          View your reflections →
        </Link>
      </motion.div>
    </Layout>
  );
}
