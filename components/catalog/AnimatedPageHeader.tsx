"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function AnimatedPageHeader({
  title,
  subtitle,
  count,
  countLabel,
}: {
  title: string;
  subtitle: string;
  count: number;
  countLabel: string;
}) {
  return (
    <motion.div
      className="hidden md:flex items-end justify-between gap-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {count} {countLabel}
      </p>
    </motion.div>
  );
}
