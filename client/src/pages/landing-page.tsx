import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LanguageToggle from "@/components/LanguageToggle";
import { motion } from "framer-motion";
import { Truck, MapPin, Clock, Shield } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
  >
    <Icon className="h-8 w-8 text-primary mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

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
          >
            <img 
              src="/attached_assets/Screenshot_2025-03-26_at_9.21.31_AM-removebg-preview.png" 
              alt="Lightning Road Logo"
              className="h-12 md:h-16"
            />
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            <FeatureCard
              icon={Truck}
              title={t('landing.features.reliability')}
              description={t('landing.features.reliabilityDesc')}
            />
            <FeatureCard
              icon={MapPin}
              title={t('landing.features.coverage')}
              description={t('landing.features.coverageDesc')}
            />
            <FeatureCard
              icon={Clock}
              title={t('landing.features.speed')}
              description={t('landing.features.speedDesc')}
            />
            <FeatureCard
              icon={Shield}
              title={t('landing.features.safety')}
              description={t('landing.features.safetyDesc')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
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
        </div>
      </div>
    </div>
  );
}