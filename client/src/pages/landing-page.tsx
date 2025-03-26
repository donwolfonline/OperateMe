import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import { motion } from "framer-motion";
import { FaGooglePlay, FaAppStore } from "react-icons/fa";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-12 w-12 text-primary"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-primary">LIGHTNING</span>
              <span className="mx-2 text-3xl font-bold text-muted-foreground">ROAD</span>
            </div>
          </motion.div>
          <LanguageToggle />
        </div>

        <div className="mt-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
              {t('landing.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t('landing.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px] text-lg">
                {t('landing.loginButton')}
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto min-w-[200px] text-lg"
              >
                {t('landing.adminButton')}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex justify-center gap-8 mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <FaGooglePlay className="h-8 w-8" />
              <span>Google Play</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <FaAppStore className="h-8 w-8" />
              <span>App Store</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}