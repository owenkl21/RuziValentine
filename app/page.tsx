"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

type Card = {
  id: number;
  src: string;
  label: string;
  x: number;
  y: number;
  rotate: number;
  z: number;
};

const heartPositions = [
  { top: "10%", left: "8%" },
  { top: "18%", right: "12%" },
  { bottom: "20%", left: "12%" },
  { bottom: "12%", right: "10%" },
];

const createInitialCards = (): Card[] => [
  {
    id: 1,
    src: "/images/heart-1.svg",
    label: "Aeternity sparkle",
    x: 0,
    y: 0,
    rotate: -8,
    z: 1,
  },
  {
    id: 2,
    src: "/images/heart-2.svg",
    label: "Aeternity bloom",
    x: 160,
    y: 10,
    rotate: 6,
    z: 2,
  },
  {
    id: 3,
    src: "/images/heart-3.svg",
    label: "Aeternity wish",
    x: 90,
    y: 140,
    rotate: -4,
    z: 3,
  },
  {
    id: 4,
    src: "/images/heart-1.svg",
    label: "Aeternity glow",
    x: 260,
    y: 100,
    rotate: 8,
    z: 4,
  },
  {
    id: 5,
    src: "/images/heart-2.svg",
    label: "Aeternity whisper",
    x: 40,
    y: 220,
    rotate: -10,
    z: 5,
  },
  {
    id: 6,
    src: "/images/heart-3.svg",
    label: "Aeternity flutter",
    x: 200,
    y: 230,
    rotate: 4,
    z: 6,
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [cards, setCards] = useState<Card[]>(() => createInitialCards());
  const [noPos, setNoPos] = useState({ x: 30, y: 10 });
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonAreaRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    id: number;
    offsetX: number;
    offsetY: number;
    pointerId: number;
  } | null>(null);

  const moveNoButton = useCallback((pointer?: { x: number; y: number }) => {
    const area = buttonAreaRef.current;
    const button = noButtonRef.current;
    if (!area || !button) {
      return;
    }
    const areaRect = area.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const maxX = Math.max(areaRect.width - buttonRect.width - 8, 0);
    const maxY = Math.max(areaRect.height - buttonRect.height - 8, 0);
    let nextX = Math.random() * maxX;
    let nextY = Math.random() * maxY;

    if (pointer) {
      const padding = 120;
      let attempts = 0;
      while (attempts < 12) {
        const candidateX = Math.random() * maxX;
        const candidateY = Math.random() * maxY;
        const centerX = areaRect.left + candidateX + buttonRect.width / 2;
        const centerY = areaRect.top + candidateY + buttonRect.height / 2;
        const distance = Math.hypot(centerX - pointer.x, centerY - pointer.y);
        if (distance > padding) {
          nextX = candidateX;
          nextY = candidateY;
          break;
        }
        attempts += 1;
      }
    }

    setNoPos({ x: nextX, y: nextY });
  }, []);

  const handleButtonAreaMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const button = noButtonRef.current;
      if (!button) {
        return;
      }
      const buttonRect = button.getBoundingClientRect();
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      const distance = Math.hypot(centerX - event.clientX, centerY - event.clientY);
      if (distance < 140) {
        moveNoButton({ x: event.clientX, y: event.clientY });
      }
    },
    [moveNoButton],
  );

  const bringCardToFront = useCallback((id: number) => {
    setCards((prev) => {
      const maxZ = Math.max(...prev.map((card) => card.z));
      return prev.map((card) =>
        card.id === id ? { ...card, z: maxZ + 1 } : card,
      );
    });
  }, []);

  const handlePointerDown = useCallback(
    (id: number) => (event: React.PointerEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const container = cardsRef.current;
      if (!container) {
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      dragRef.current = {
        id,
        offsetX: event.clientX - targetRect.left,
        offsetY: event.clientY - targetRect.top,
        pointerId: event.pointerId,
      };
      bringCardToFront(id);
      target.setPointerCapture(event.pointerId);
      const nextX = targetRect.left - containerRect.left;
      const nextY = targetRect.top - containerRect.top;
      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, x: nextX, y: nextY } : card,
        ),
      );
    },
    [bringCardToFront],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragData = dragRef.current;
      const container = cardsRef.current;
      if (!dragData || !container || dragData.pointerId !== event.pointerId) {
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const nextX = event.clientX - containerRect.left - dragData.offsetX;
      const nextY = event.clientY - containerRect.top - dragData.offsetY;
      const maxX = containerRect.width - 140;
      const maxY = containerRect.height - 140;
      setCards((prev) =>
        prev.map((card) =>
          card.id === dragData.id
            ? {
                ...card,
                x: clamp(nextX, 0, maxX),
                y: clamp(nextY, 0, maxY),
              }
            : card,
        ),
      );
    },
    [],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragData = dragRef.current;
      if (!dragData || dragData.pointerId !== event.pointerId) {
        return;
      }
      dragRef.current = null;
    },
    [],
  );

  const envelopeText = useMemo(
    () => (accepted ? "My heart is doing cartwheels!" : "Tap to open your letter"),
    [accepted],
  );

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
              <span className="sparkle">✨</span>
              <div className="floating-hearts">
                {heartPositions.map((pos, index) => (
                  <span key={index} style={pos}>
                    💖
                  </span>
                ))}
              </div>
              <span>Love letter loading...</span>
              <h2>{envelopeText}</h2>
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
                onPointerLeave={handlePointerUp}
              >
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="card"
                    style={{
                      transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
                      zIndex: card.z,
                    }}
                    onPointerDown={handlePointerDown(card.id)}
                  >
                    <Image src={card.src} alt={card.label} width={110} height={110} />
                    <span>{card.label}</span>
                  </div>
                ))}
              </div>

              <div className="question-area">
                <h4>Will you be my Valentine?</h4>
                <p>Choose wisely — the little “no” is feeling shy.</p>
                <div
                  className="button-row"
                  ref={buttonAreaRef}
                  onPointerMove={handleButtonAreaMove}
                  onPointerDown={handleButtonAreaMove}
                >
                  <button
                    className="btn btn-yes"
                    type="button"
                    onClick={() => setAccepted(true)}
                  >
                    Yes, always!
                  </button>
                  <button
                    ref={noButtonRef}
                    className="btn btn-no"
                    type="button"
                    style={{ left: noPos.x, top: noPos.y }}
                    onPointerEnter={() => moveNoButton()}
                    onClick={() => moveNoButton()}
                    onFocus={() => moveNoButton()}
                  >
                    No (if you can catch me)
                  </button>
                </div>
                {accepted && (
                  <div className="yay">
                    <h5>Yay! 💕</h5>
                    <p>
                      You just made this letter the happiest in the whole mailbox.
                      Let&apos;s plan something sweet!
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
