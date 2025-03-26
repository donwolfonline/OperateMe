import { useEffect } from 'react';
import { useNavigationLoading } from '@/hooks/use-navigation-loading';
import { LoadingSpinner } from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const { isLoading } = useNavigationLoading();
  const { t } = useTranslation();

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <LoadingSpinner size="lg" text={t('common.loading')} />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
