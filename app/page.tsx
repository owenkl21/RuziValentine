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
  // {
  //   id: 1,
  //   src: "/couples/couple1.jpeg",
  //   label: "Goue-uur gloed",
  //   className: "card-slot-1",
  //   rotate: -6,
  //   priority: true,
  // },
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
    label: "Stilte saam",
    className: "card-slot-4",
    rotate: 8,
  },
  {
    id: 5,
    src: "/couples/couple5.jpeg",
    label: "Die Verloofde Dans",
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
  {
    id: 7,
    src: "/couples/couple7.jpeg",
    label: "Vir altyd ons",
    className: "card-slot-7",
    rotate: 10,
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
              <h3>Liewe Ruzi,</h3>
              <p>
                Elke dag dank ek God vir jou, vir jou hart, jou liefde en die pad wat ons saam stap. Jy is my veilige plek, my vreugde en my beste vriend. Ek sien so uit na ons toekoms saam, hand aan hand, met God in die middel van alles wat ons doen.
              </p>
              <p>“Bo alles moet julle mekaar innig liefhê, want die liefde bedek baie sondes.”
(1 Petrus 4:8)</p>
              <p>Gelukkige Valentynsdag, my liefde. Ek kies jou, vandag en elke dag</p>
              <p>Met al my Liefde,</p>
              <p>Jou Verloofde!</p>
              <div className="question-area">
                <h4>Sal jy my Valentyn wees?</h4>
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
                      Nee
                    </button>
                    <button
                      className="btn btn-yes"
                      type="button"
                      onClick={handleYesClick}
                    >
                      Ja
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
