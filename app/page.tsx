"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "./components/ui/draggable-card";

type Card = {
  id: number;
  src: string;
  label: string;
  className: string;
  rotate: number;
  priority?: boolean;
};

const createInitialCards = (): Card[] => [
  {
    id: 1,
    src: "/couples/couple1.jpeg",
    label: "Jy is my alles",
    className: "card-slot-1",
    rotate: -6,
    priority: true,
  },
  {
    id: 2,
    src: "/couples/couple2.jpeg",
    label: "Snaakse oomblikke",
    className: "card-slot-2",
    rotate: -4,
    priority: true,
  },
  {
    id: 3,
    src: "/couples/couple3.jpeg",
    label: "Liefde in oorvloed",
    className: "card-slot-3",
    rotate: 4,
  },
  {
    id: 4,
    src: "/couples/couple4.jpeg",
    label: "Snaakse oomblikke",
    className: "card-slot-4",
    rotate: 8,
  },
  {
    id: 5,
    src: "/couples/couple5.jpeg",
    label: "Ons teen die wêreld",
    className: "card-slot-5",
    rotate: -8,
  },
  {
    id: 6,
    src: "/couples/couple6.jpeg",
    label: "Skouer-aan-skouer",
    className: "card-slot-6",
    rotate: 2,
  },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState<string | null>(null);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const buttonRowRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const dragEnabled = accepted !== "yes";

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
    () =>
      accepted
        ? "My hart is in oorvloed!"
        : "Maak maar die briefie oop",
    [accepted],
  );

  const shouldShowCards = accepted !== "yes";

  useEffect(() => {
    if (accepted !== "yes") {
      return;
    }
    const fire = async () => {
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      confetti({ particleCount: 90, spread: 120, origin: { y: 0.4 } });
    };
    fire();
  }, [accepted]);

  return (
    <main>
      <section className="scene">
        <h1 className="title">’n Klein briefie vir my liefie 💌</h1>
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
                {/* <span className="eyebrow">Maak maar die briefie oop</span> */}
                <h2>{envelopeText}</h2>
              </div>
            </button>
          ) : (
            <div className="letter">
              <h3>My Liewe Lyf,</h3>
              <p>
                Dankie vir jou, Dankie vir wie jy vir my is en beteken, Dankie dat jy my liefhet en iemand so baie lief het so maklik te maak, ek sien my virewig in jou oë as ek net vinnig kyk maar my liefde van my lewe as ek daar in staar, dis net jy vir my, jys presies vir my gemaak en jys meerr as perfek vir my, ekt jou oneindig verskriklik onbeskryflik onophoudend lief en ek soek my virewig saam met jou❤️❤️❤️
              </p>
              <p>Aiii my lyf
Forever and a day, altyd jy🫵❤️
Whenever, Wherever🗺️🫶🏻❤️
Locked in🔐🫶🏻❤️
Onbreekbaar⛓️🫶🏻❤️
Ek en jy, virewig en viraltyd♾️🫶🏻❤️</p>
              <p>Sal jy asseblief my die gelukkigste Ou ooit maak en my valentyn wees?🫶🏻❤️</p>
              <p>Met al my Liefde,</p>
              <div className="question-area">
                <h4>Sal jy my Valentyn wees?</h4>
                {accepted !== "yes" && (
                  <div ref={buttonRowRef} className="button-row">
                    <button
                      className="btn btn-yes"
                      type="button"
                      onClick={handleYesClick}
                    >
                      Ja
                    </button>
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
                        transform: `translate(calc(var(--no-base-x, -50%) + ${noOffset.x}px), calc(var(--no-base-y, -50%) + ${noOffset.y}px))`,
                      }}
                    >
                      Nee
                    </button>
                  </div>
                )}
                {accepted && (
                  <div className="yay">
                    <h5>{accepted === "yes" ? "Ja! 💕" : "Nee... 😢"}</h5>
                    <p>
                      {accepted === "yes"
                        ? "Okay dit het langer gevat as wat ek verwag het. Nou kan ek die beste Valentynsdag ooit beplan."
                        : "Selfs ’n skaam nee kry nog ’n glimlag terug."}
                    </p>
                  </div>
                )}
              </div>
              {shouldShowCards && (
                <DraggableCardContainer
                  className="letter-card-overlay"
                  constrainToContainer={false}
                >
                  {/* <p className="card-hint">
                    As dit jou eerste dag by Fight Club is, moet jy baklei (maar net
                    met glimlagte).
                  </p> */}
                  {createInitialCards().map((card) => (
                    <DraggableCardBody
                      key={card.id}
                      className={`heart-card ${card.className}`}
                      isDraggable={dragEnabled}
                      style={{ transform: `rotate(${card.rotate}deg)` }}
                    >
                      <div className="card-media">
                        <Image
                          src={card.src}
                          alt={card.label}
                          fill
                          sizes="(max-width: 720px) 140px, 180px"
                          className="card-photo"
                          draggable={false}
                          onDragStart={(event) => event.preventDefault()}
                          priority={card.priority}
                          quality={70}
                        />
                      </div>
                      <h3>{card.label}</h3>
                    </DraggableCardBody>
                  ))}
                </DraggableCardContainer>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
