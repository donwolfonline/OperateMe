import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function HomeButton() {
  const { t } = useTranslation();

  return (
    <Link href="/">
      <div className="flex items-center gap-2 p-2 hover:opacity-80 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-8 w-8 text-primary"
          fill="currentColor"
        >
          <path d="M12 2L2 8l10 6 10-6-10-6zM2 16l10 6 10-6-10-6-10 6z" />
        </svg>
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary hidden sm:inline">{t('landing.brandFirst')}</span>
          <span className="mx-1 text-xl font-bold text-muted-foreground hidden sm:inline">{t('landing.brandSecond')}</span>
        </div>
      </div>
    </Link>
  );
}