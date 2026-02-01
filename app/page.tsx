"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DraggableCard,
  DraggableCardContainer,
} from "./components/ui/draggable-card";

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

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState<string | null>(null);
  const [showCards, setShowCards] = useState(false);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const buttonRowRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleYesClick = useCallback(() => {
    setAccepted("yes");
    setShowCards(false);
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

  useEffect(() => {
    if (accepted !== "yes") {
      return;
    }
    let timeout: NodeJS.Timeout | null = null;
    const fire = async () => {
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      confetti({ particleCount: 90, spread: 120, origin: { y: 0.4 } });
      timeout = setTimeout(() => setShowCards(true), 350);
    };
    fire();
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [accepted]);

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

              <div className="question-area">
                <h4>Will you be my Valentine?</h4>
                <p>Say yes to open the surprise hearts.</p>
                {accepted !== "yes" && (
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
                    <button
                      className="btn btn-yes"
                      type="button"
                      onClick={handleYesClick}
                    >
                      Yes
                    </button>
                  </div>
                )}
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
              {accepted === "yes" && (
                <div className="draggable-card-area">
                  <h4>Drag the hearts anywhere ✨</h4>
                  <p>No swiping needed—just play with the cards.</p>
                  {showCards ? (
                    <DraggableCardContainer>
                      {createInitialCards().map((card, index) => (
                        <DraggableCard
                          key={card.id}
                          className="heart-card"
                          style={{
                            top: `${12 + index * 8}%`,
                            left: `${8 + (index % 3) * 22}%`,
                          }}
                          initial={{ rotate: index * 4 - 6 }}
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
                        </DraggableCard>
                      ))}
                    </DraggableCardContainer>
                  ) : (
                    <div className="card-loading">Confetti incoming…</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
