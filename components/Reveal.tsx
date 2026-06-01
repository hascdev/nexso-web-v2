"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
  playOnMount = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
  playOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const inViewProps = {
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
  } as const;
  const mountProps = { animate: { opacity: 1, y: 0 } } as const;

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      transition={{ duration: reduce ? 0 : 0.45, delay, ease: EASE }}
      {...(playOnMount ? mountProps : inViewProps)}
    >
      {children}
    </MotionTag>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

export function RevealStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : itemVariants}
    >
      {children}
    </motion.div>
  );
}
