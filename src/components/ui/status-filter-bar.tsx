"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  count: number;
  icon: React.ElementType;
  color: "blue" | "green" | "orange" | "red" | "slate" | "amber" | "teal" | "gray";
}

export interface StatusFilterBarProps {
  options: FilterOption[];
  currentValue: string;
  onSelect: (value: string) => void;
  className?: string;
}

const colorMap: Record<
  FilterOption["color"],
  {
    bg: string;
    text: string;
    border: string;
    activeBorder: string;
    activeRing: string;
    iconBg: string;
  }
> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    activeBorder: "border-blue-400",
    activeRing: "ring-blue-400",
    iconBg: "bg-blue-100",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    activeBorder: "border-emerald-400",
    activeRing: "ring-emerald-400",
    iconBg: "bg-emerald-100",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
    activeBorder: "border-orange-400",
    activeRing: "ring-orange-400",
    iconBg: "bg-orange-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    activeBorder: "border-amber-400",
    activeRing: "ring-amber-400",
    iconBg: "bg-amber-100",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    activeBorder: "border-red-400",
    activeRing: "ring-red-400",
    iconBg: "bg-red-100",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-100",
    activeBorder: "border-teal-400",
    activeRing: "ring-teal-400",
    iconBg: "bg-teal-100",
  },
  slate: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    activeBorder: "border-slate-400",
    activeRing: "ring-slate-400",
    iconBg: "bg-slate-200",
  },
  gray: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    activeBorder: "border-gray-400",
    activeRing: "ring-gray-400",
    iconBg: "bg-gray-200",
  },
};

const springTransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
};

export function StatusFilterBar({
  options,
  currentValue,
  onSelect,
  className,
}: StatusFilterBarProps) {
  const instanceId = React.useId().replace(/:/g, "");
  const lgCols = options.length;

  return (
    <>
      <style>{`@media(min-width:1024px){[data-sfb="${instanceId}"]{grid-template-columns:repeat(${lgCols},minmax(0,1fr))!important}}`}</style>
      <div
        role="radiogroup"
        aria-label="Status filter"
        data-sfb={instanceId}
        className={cn(
          "grid grid-cols-2 gap-2",
          "md:grid-cols-4 md:gap-3",
          "lg:gap-4",
          className
        )}
      >
        {options.map((option) => {
          const isActive = option.value === currentValue;
          const colors = colorMap[option.color];
          const Icon = option.icon;

          return (
            <motion.button
              key={option.value}
              role="radio"
              aria-checked={isActive}
              aria-label={`${option.label}: ${option.count}`}
              onClick={() => onSelect(option.value)}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={springTransition}
              className={cn(
                "relative text-left overflow-hidden rounded-xl cursor-pointer group",
                "outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "p-4 transition-all duration-200",
                "border",
                colors.bg,
                isActive ? "border-transparent shadow-md" : cn(colors.border, "hover:shadow-md")
              )}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="status-filter-active-border"
                    className={cn(
                      "absolute inset-0 rounded-xl border ring-1 ring-offset-0 pointer-events-none",
                      colors.activeBorder,
                      colors.activeRing
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                      mass: 0.8,
                    }}
                  />
                )}
              </AnimatePresence>

              <Icon
                className={cn(
                  "absolute -right-6 -bottom-6 w-24 h-24 opacity-10 transition-transform duration-300 group-hover:scale-110",
                  colors.text
                )}
              />

              <div className="relative z-10 flex justify-between items-start mb-2">
                <div className={cn("p-2 rounded-lg", colors.text, colors.iconBg)}>
                  <Icon className="w-5 h-5" />
                </div>

                <motion.span
                  className={cn("text-2xl font-bold", colors.text)}
                  key={`count-${option.value}-${isActive}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {option.count}
                </motion.span>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className={cn("text-sm font-medium opacity-80", colors.text)}>
                  {option.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
