import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import StarsEffect from "./StarEffects"; // Make sure this file is correctly JSX if you're not using TS
import { Canvas } from "@react-three/fiber";
import StarsLayer from "./StarLayers";
import Reveal from "./Reveal";

const HEADER_HEIGHT = 60;

const App = () => {
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(window.innerHeight);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  // Responsive resize
  useEffect(() => {
    const handleResize = () => setSectionHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const triggerPoint = window.innerHeight * 0.5;
      if (scrollY > triggerPoint && !triggerAnimation) {
        setTriggerAnimation(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerAnimation]);
  const sections = [
    {
      title: "Welcome",
      description: "This is the welcome section.",
      backgroundColor: "lightcoral",
    },
    {
      title: "About Us",
      description: "Learn more about our mission and values.",
      backgroundColor: "lightblue",
    },
    {
      title: "Services",
      description: "Explore the services we offer.",
      backgroundColor: "lightgreen",
    },
    {
      title: "Portfolio",
      description: "Take a look at some of our past work.",
      backgroundColor: "khaki",
    },
    {
      title: "Contact",
      description: "Get in touch with us for more information.",
      backgroundColor: "plum",
    },
    {
      title: "Footer",
      description: "Thanks for visiting!",
      backgroundColor: "green",
    },
  ];

  const scrollToSection = (index) => {
    const targetY = index * sectionHeight;
    containerRef.current.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
    setCurrentSection(index);
  };

  // Scroll snapping logic
  useEffect(() => {
    const container = containerRef.current;
    let timeoutId = null;

    const handleScroll = () => {
      if (isScrolling) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const sectionIndex = Math.round(scrollTop / sectionHeight);
        scrollToSection(sectionIndex);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 800);
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isScrolling, sectionHeight]);

  // Touch swiping (mobile)
  useEffect(() => {
    const container = containerRef.current;
    let startY = 0;

    const onTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      const endY = e.changedTouches[0].clientY;
      const direction = endY > startY ? -1 : 1;

      let next = currentSection + direction;
      if (next < 0) next = 0;
      if (next >= sections.length) next = sections.length - 1;

      scrollToSection(next);
    };

    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchend", onTouchEnd);
    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentSection, sectionHeight]);

  const isMobile = window.innerWidth <= 768;
  const finalTop = currentSection === 2 ? (isMobile ? "72vh" : "52vh") : "24vh";

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundImage: `radial-gradient(circle at 0% 100%, #010729 13%, rgba(0, 0, 88, 0) 66%),
                        radial-gradient(circle at 100% 0, #0c0c97, #0c0c97 11%, rgba(13, 13, 143, 0) 84%),
                        linear-gradient(to bottom, #000d53, #000d53)`,
        backgroundRepeat: "repeat-y",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: `${HEADER_HEIGHT}px`,
          width: "100%",
          backgroundColor: "#333",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <h1 style={{ fontSize: "18px" }}>My Fixed Header</h1>
      </header>

      {/* Star Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          triggerAnimation
            ? { opacity: 1, top: finalTop }
            : { opacity: 0, top: "0vh" }
        }
        transition={{
          duration: 0.75,
          ease: "easeIn",
          top: { duration: 1, ease: "easeInOut" },
        }}
        className="canvasContainer"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          zIndex: 1,
        }}
      >
        <Canvas camera={{ position: [0, 0, 200], fov: 60 }}>
          <StarsEffect triggerAnimation={triggerAnimation} />
        </Canvas>
      </motion.div>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: `${HEADER_HEIGHT}px`,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "scroll",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          overscrollBehavior: "none",
          WebkitOverflowScrolling: "touch",
          zIndex: 1,
        }}
      >
        {sections.map(({ title, description }, i) => (
          <div
            key={i}
            style={{
              height: `${sectionHeight}px`,
              width: "100vw",
              // backgroundColor,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: `${HEADER_HEIGHT + 40}px`,
              paddingLeft: "40px",
              boxSizing: "border-box",
              color: "#fff",
            }}
          >
            <Reveal>
              <h2>{title}</h2>
              <p>{description}</p>
            </Reveal>
          </div>
        ))}
      </div>
      <StarsLayer position="top" />
      <StarsLayer position="bottom" />
      {/* Footer Elements */}
      {currentSection < sections.length - 1 && (
        <>
          {/* Gradient overlay */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "120px",
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)",
              pointerEvents: "none",
              zIndex: 500,
            }}
          />

          {/* Page Counter */}
          <div
            style={{
              position: "fixed",
              bottom: 20,
              left: 20,
              background: "#000000cc",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "5px",
              fontSize: "14px",
              zIndex: 1001,
            }}
          >
            {currentSection + 1} / {sections.length}
          </div>

          {/* Skip Button */}
          <button
            onClick={() => scrollToSection(sections.length - 1)}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              zIndex: 1001,
            }}
          >
            Skip
          </button>
        </>
      )}
    </div>
  );
};

export default App;
