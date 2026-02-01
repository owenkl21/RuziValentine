"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

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

type DraggableCardPosition = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number | null;
  origin: DraggableCardPosition;
  start: DraggableCardPosition;
};

type DraggableCardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export function DraggableCard({
  children,
  className,
  style,
  ...props
}: DraggableCardProps) {
  const constraintsRef = useContext(ConstraintsContext);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<DraggableCardPosition>({
    x: 0,
    y: 0,
  });
  const dragStateRef = useRef<DragState>({
    pointerId: null,
    origin: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
  });

  const getConstraints = useCallback(() => {
    const container = constraintsRef?.current;
    const card = cardRef.current;

    if (!container || !card) {
      return null;
    }

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    return {
      minX: 0,
      minY: 0,
      maxX: Math.max(0, containerRect.width - cardRect.width),
      maxY: Math.max(0, containerRect.height - cardRect.height),
    };
  }, [constraintsRef]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      dragStateRef.current = {
        pointerId: event.pointerId,
        origin: { x: event.clientX, y: event.clientY },
        start: { ...position },
      };
    },
    [position],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragStateRef.current.pointerId !== event.pointerId) {
        return;
      }

      const constraints = getConstraints();
      const deltaX = event.clientX - dragStateRef.current.origin.x;
      const deltaY = event.clientY - dragStateRef.current.origin.y;

      let nextX = dragStateRef.current.start.x + deltaX;
      let nextY = dragStateRef.current.start.y + deltaY;

      if (constraints) {
        nextX = Math.min(constraints.maxX, Math.max(constraints.minX, nextX));
        nextY = Math.min(constraints.maxY, Math.max(constraints.minY, nextY));
      }

      setPosition({ x: nextX, y: nextY });
    },
    [getConstraints],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragStateRef.current.pointerId !== event.pointerId) {
        return;
      }

      event.currentTarget.releasePointerCapture(event.pointerId);
      dragStateRef.current = {
        pointerId: null,
        origin: { x: 0, y: 0 },
        start: { ...position },
      };
    },
    [position],
  );

  const mergedStyle = useMemo<React.CSSProperties>(() => {
    const baseTransform = style?.transform ? `${style.transform} ` : "";

    return {
      ...style,
      touchAction: "none",
      transform: `${baseTransform}translate3d(${position.x}px, ${position.y}px, 0)`,
    };
  }, [position.x, position.y, style]);

  return (
    <div
      ref={cardRef}
      className={`draggable-card${className ? ` ${className}` : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={mergedStyle}
      {...props}
    >
      {children}
    </div>
  );
}
