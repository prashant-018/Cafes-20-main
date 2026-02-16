import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl"
      >
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          This page is currently being prepared to match the high-end Himalayan experience. 
          Stay tuned for updates!
        </p>
        
        <Link to="/">
          <Button variant="outline" className="rounded-full border-white/20 text-white gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
