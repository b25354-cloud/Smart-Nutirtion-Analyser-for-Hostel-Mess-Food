import { motion } from 'framer-motion';

import { motionTokens } from '@/config/theme';

export const TopNav = () => (
  <motion.header
    className="flex items-center justify-between border-b border-border bg-surface px-4 py-3"
    transition={{ duration: motionTokens.duration.fast, ease: motionTokens.ease.standard }}
  >
    <span className="font-semibold">MessMate AI</span>
  </motion.header>
);
