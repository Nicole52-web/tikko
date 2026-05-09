import React, { useEffect, useState } from "react";

import sign1 from "../assests/sign1.jpg";
import sign2 from "../assests/sign2.jpg";
import sign3 from "../assests/sign3.jpg";
import sign4 from "../assests/sign4.jpg";

const IMAGES = [sign1, sign2, sign3, sign4];

const AuthBackgroundCarousel = ({ intervalMs = 6500 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(media.matches);

    onChange();
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    if (IMAGES.length < 2) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % IMAGES.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, reduceMotion]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      {IMAGES.map((src, idx) => (
        <div
          key={`${src}-${idx}`}
          className={[
            "absolute inset-0 flex items-center justify-center p-4 sm:p-8",
            "transition-opacity duration-1000 ease-in-out",
            idx === activeIndex ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <img
            src={src}
            alt=""
            aria-hidden
            draggable={false}
            className="h-auto w-auto max-h-[min(78vh,820px)] max-w-[min(92vw,1100px)] object-contain select-none pointer-events-none"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-blue-900/30" />
    </div>
  );
};

export default AuthBackgroundCarousel;
