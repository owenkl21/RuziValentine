"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Card = {
  id: number;
  src: string;
  label: string;
};

const createInitialCards = (): Card[] => [
  {
    id: 1,
    src: "/images/heart-1.svg",
    label: "Aeternity sparkle",
  },
  {
    id: 2,
    src: "/images/heart-2.svg",
    label: "Aeternity bloom",
  },
  {
    id: 3,
    src: "/images/heart-3.svg",
    label: "Aeternity wish",
  },
  {
    id: 4,
    src: "/images/heart-1.svg",
    label: "Aeternity glow",
  },
  {
    id: 5,
    src: "/images/heart-2.svg",
    label: "Aeternity whisper",
  },
  {
    id: 6,
    src: "/images/heart-3.svg",
    label: "Aeternity flutter",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>(() => createInitialCards());
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const buttonRowRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const dragRef = useRef<{
    id: number;
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);

  const activeCard = cards[0];

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!activeCard) {
        return;
      }
      dragRef.current = {
        id: activeCard.id,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [activeCard],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragData = dragRef.current;
      if (!dragData || dragData.pointerId !== event.pointerId) {
        return;
      }
      setDragOffset({
        x: event.clientX - dragData.startX,
        y: event.clientY - dragData.startY,
      });
    },
    [],
  );

  const resetDrag = useCallback(() => {
    dragRef.current = null;
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragData = dragRef.current;
      if (!dragData || dragData.pointerId !== event.pointerId) {
        return;
      }
      const decisionThreshold = 130;
      if (Math.abs(dragOffset.x) > decisionThreshold) {
        const decision = dragOffset.x > 0 ? "yes" : "no";
        setAccepted(decision);
        setCards((prev) => prev.filter((card) => card.id !== dragData.id));
      }
      resetDrag();
    },
    [dragOffset.x, resetDrag],
  );

  const handlePointerLeave = useCallback(() => {
    if (dragRef.current) {
      resetDrag();
    }
  }, [resetDrag]);

  const handleYesClick = useCallback(() => {
    setAccepted("yes");
  }, []);

  const moveNoButton = useCallback(() => {
    const row = buttonRowRef.current;
    const button = noButtonRef.current;
    if (!row || !button) {
      return;
    }
    const rowRect = row.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const padding = 12;
    const maxX = Math.max((rowRect.width - buttonRect.width) / 2 - padding, 0);
    const maxY = Math.max((rowRect.height - buttonRect.height) / 2 - padding, 0);
    const nextX = (Math.random() * 2 - 1) * maxX;
    const nextY = (Math.random() * 2 - 1) * maxY;
    setNoOffset({ x: nextX, y: nextY });
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      moveNoButton();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [moveNoButton]);

  const envelopeText = useMemo(
    () => (accepted ? "My heart is doing cartwheels!" : "Tap to open your letter"),
    [accepted],
  );
  const yesOpacity = clamp((dragOffset.x - 30) / 120, 0, 1);
  const noOpacity = clamp((-dragOffset.x - 30) / 120, 0, 1);

  return (
    <main>
      <section className="scene">
        <h1 className="title">A tiny letter just for you 💌</h1>
        <div className={`envelope ${isOpen ? "open" : ""}`}>
          <div className="envelope-back" aria-hidden="true" />
          <div className="envelope-flap" aria-hidden="true" />
          {!isOpen ? (
            <button
              className="envelope-closed"
              type="button"
              onClick={() => setIsOpen(true)}
            >
              <div className="envelope-front">
                <div className="envelope-top" />
                <div className="envelope-bottom" />
                <span className="stamp">💌</span>
              </div>
              <div className="envelope-copy">
                <span className="sparkle">✨</span>
                <span className="eyebrow">Sealed with love</span>
                <h2>{envelopeText}</h2>
              </div>
            </button>
          ) : (
            <div className="letter">
              <h3>Dear You,</h3>
              <p>
                I made a pocket-sized constellation just for us. Pull the Aeternity
                hearts around, keep one in your pocket, and let the others float back
                to me.
              </p>

              <div
                ref={cardsRef}
                className="cards"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
              >
                <div className="card-label card-label-no" style={{ opacity: noOpacity }}>
                  No
                </div>
                <div className="card-label card-label-yes" style={{ opacity: yesOpacity }}>
                  Yes
                </div>
                <div className="card-stack">
                  {cards.map((card, index) => {
                    const isTop = index === 0;
                    const baseOffset = Math.min(index * 10, 30);
                    const baseScale = 1 - index * 0.04;
                    const dragX = isTop ? dragOffset.x : 0;
                    const dragY = isTop ? dragOffset.y : 0;
                    const rotate = isTop ? clamp(dragOffset.x / 12, -14, 14) : 0;
                    return (
                      <div
                        key={card.id}
                        className={`card ${isTop ? "card-active" : ""}`}
                        style={{
                          transform: `translate(${dragX}px, ${dragY + baseOffset}px) rotate(${rotate}deg) scale(${baseScale})`,
                          zIndex: cards.length - index,
                        }}
                        onPointerDown={isTop ? handlePointerDown : undefined}
                      >
                        <div className="card-media">
                          <Image
                            src={card.src}
                            alt={card.label}
                            width={180}
                            height={180}
                          />
                        </div>
                        <span>{card.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="question-area">
                <h4>Will you be my Valentine?</h4>
                <p>Drag a card left for “no” or right for “yes”.</p>
                <div ref={buttonRowRef} className="button-row">
                  <button
                    ref={noButtonRef}
                    className="btn btn-no btn-no-escape"
                    type="button"
                    onPointerEnter={moveNoButton}
                    onPointerDown={moveNoButton}
                    onClick={(event) => {
                      event.preventDefault();
                      moveNoButton();
                    }}
                    style={{
                      transform: `translate(calc(-50% + ${noOffset.x}px), calc(-50% + ${noOffset.y}px))`,
                    }}
                  >
                    No
                  </button>
                  <button className="btn btn-yes" type="button" onClick={handleYesClick}>
                    Yes
                  </button>
                </div>
                {accepted && (
                  <div className="yay">
                    <h5>{accepted === "yes" ? "Yes! 💕" : "No... 😢"}</h5>
                    <p>
                      {accepted === "yes"
                        ? "Okay wow—now I get to plan our sweetest date yet."
                        : "Even a shy no still gets a smile back."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
