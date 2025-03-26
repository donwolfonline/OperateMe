import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className = "", size = 'md' }: LogoProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const sizes = {
    sm: {
      wrapper: "gap-1",
      icon: "h-6 w-6",
      text: "text-sm"
    },
    md: {
      wrapper: "gap-2",
      icon: "h-8 w-8",
      text: "text-base"
    },
    lg: {
      wrapper: "gap-3",
      icon: "h-10 w-10",
      text: "text-lg"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center ${sizes[size].wrapper} ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`${sizes[size].icon} text-primary`}
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <div className={`flex items-center ${isRTL ? 'mr-1' : 'ml-1'}`}>
        <span className={`${sizes[size].text} font-bold text-primary whitespace-nowrap`}>
          {t('landing.brandFirst')}
        </span>
        <span className={`${sizes[size].text} font-bold text-muted-foreground whitespace-nowrap ${isRTL ? 'mr-1' : 'ml-1'}`}>
          {t('landing.brandSecond')}
        </span>
      </div>
    </motion.div>
  );
};
