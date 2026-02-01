"use client";

import React, { createContext, useContext, useRef } from "react";
import { motion } from "framer-motion";

type ConstraintsContextValue = React.RefObject<HTMLDivElement> | null;

const ConstraintsContext = createContext<ConstraintsContextValue>(null);

type DraggableCardContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function DraggableCardContainer({
  children,
  className,
}: DraggableCardContainerProps) {
  const constraintsRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={constraintsRef}
      className={`draggable-card-container${className ? ` ${className}` : ""}`}
    >
      <ConstraintsContext.Provider value={constraintsRef}>
        {children}
      </ConstraintsContext.Provider>
    </div>
  );
}

type DraggableCardProps = React.ComponentProps<typeof motion.div> & {
  className?: string;
};

export function DraggableCard({
  children,
  className,
  style,
  ...props
}: DraggableCardProps) {
  const constraintsRef = useContext(ConstraintsContext);

  return (
    <motion.div
      drag
      dragElastic={0.18}
      dragMomentum={false}
      dragConstraints={constraintsRef ?? undefined}
      className={`draggable-card${className ? ` ${className}` : ""}`}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
