"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ConstraintsContextValue = {
  ref: React.RefObject<HTMLDivElement> | null;
  constrainToContainer: boolean;
} | null;

const ConstraintsContext = createContext<ConstraintsContextValue>(null);

type DraggableCardContainerProps = {
  children: React.ReactNode;
  className?: string;
  constrainToContainer?: boolean;
};

export function DraggableCardContainer({
  children,
  className,
  constrainToContainer = true,
}: DraggableCardContainerProps) {
  const constraintsRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={constraintsRef}
      className={`draggable-card-container${className ? ` ${className}` : ""}`}
    >
      <ConstraintsContext.Provider
        value={{ ref: constraintsRef, constrainToContainer }}
      >
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

type DraggableCardBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  isDraggable?: boolean;
};

export function DraggableCardBody({
  children,
  className,
  isDraggable = true,
  style,
  ...props
}: DraggableCardBodyProps) {
  const constraintsContext = useContext(ConstraintsContext);
  const constraintsRef = constraintsContext?.ref ?? null;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<DraggableCardPosition>({
    x: 0,
    y: 0,
  });
  const shouldConstrain = constraintsContext?.constrainToContainer ?? true;
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

    const maxX = Math.max(0, containerRect.width - cardRect.width);
    const maxY = Math.max(0, containerRect.height - cardRect.height);

    return {
      minX: -maxX,
      minY: -maxY,
      maxX,
      maxY,
    };
  }, [constraintsRef]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggable) {
        return;
      }
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
    [isDraggable, position],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggable) {
        return;
      }
      if (dragStateRef.current.pointerId !== event.pointerId) {
        return;
      }

      const constraints = shouldConstrain ? getConstraints() : null;
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
    [getConstraints, isDraggable, shouldConstrain],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggable) {
        return;
      }
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
    [isDraggable, position],
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
      className={`draggable-card-body${className ? ` ${className}` : ""}`}
      data-draggable={isDraggable}
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
