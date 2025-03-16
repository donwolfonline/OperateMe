import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
    >
      {i18n.language === "ar" ? "English" : "العربية"}
    </Button>
  );
}
