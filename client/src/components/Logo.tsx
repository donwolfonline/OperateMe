import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className = "", size = 'md' }: LogoProps) => {
  const { t } = useTranslation();

  const sizes = {
    sm: {
      wrapper: "gap-2",
      icon: "h-4 w-4",
      text: "text-lg"  
    },
    md: {
      wrapper: "gap-2",
      icon: "h-5 w-5",
      text: "text-xl"  
    },
    lg: {
      wrapper: "gap-3",
      icon: "h-6 w-6",
      text: "text-2xl"  
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
        className={`${sizes[size].icon} text-primary shrink-0`}
        fill="currentColor"
      >
        <path d="M12 2L2 8l10 6 10-6-10-6zM2 16l10 6 10-6-10-6-10 6z" />
      </svg>
      <div className={`flex items-center`}>
        <span className={`${sizes[size].text} font-bold text-primary whitespace-nowrap`}>
          {t('landing.brandFirst')}
        </span>
        <span className={`${sizes[size].text} font-bold text-muted-foreground whitespace-nowrap ml-1`}>
          {t('landing.brandSecond')}
        </span>
      </div>
    </motion.div>
  );
};