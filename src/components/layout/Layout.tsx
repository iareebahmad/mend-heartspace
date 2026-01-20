import { ReactNode, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SOSModal } from "@/components/ui/SOSModal";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sosOpen, setSosOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-18">
        {children}
      </main>
      <Footer />

      {/* Floating SOS Button - Mobile Only */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        onClick={() => setSosOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-lilac shadow-soft hover:shadow-hover flex items-center justify-center transition-all duration-300 active:scale-95"
        aria-label="SOS - Need support"
      >
        <Heart className="w-6 h-6 text-white fill-white/30" />
      </motion.button>

      <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
