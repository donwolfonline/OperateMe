import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LanguageToggle from "@/components/LanguageToggle";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        <Card className="mt-20 max-w-3xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4">
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
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">{t('landing.title')}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('landing.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  {t('landing.loginButton')}
                </Button>
              </Link>
              <Link href="/admin">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto"
                >
                  {t('landing.adminButton')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}