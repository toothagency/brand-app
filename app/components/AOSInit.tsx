"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AOSInit = () => {
  useEffect(() => {
    // Add CSS to prevent overflow during animations
    const style = document.createElement("style");
    style.textContent = `
      [data-aos] {
        overflow: hidden !important;
      }
      body {
        overflow-x: hidden !important;
      }
      .aos-animate {
        overflow: visible !important;
      }
    `;
    document.head.appendChild(style);

    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 100,
      delay: 0,
    });

    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default AOSInit;
