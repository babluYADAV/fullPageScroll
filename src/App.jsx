import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const HEADER_HEIGHT = 60;

const App = () => {
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const sectionHeight = window.innerHeight;

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
        setTimeout(() => setIsScrolling(false), 1000);
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isScrolling]);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Fixed Header */}
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

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        style={{
          height: "100%",
          width: "100%",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          scrollPaddingTop: `${HEADER_HEIGHT}px`,
          marginTop: `${HEADER_HEIGHT}px`,
        }}
      >
        {sections.map(({ title, description, backgroundColor }, i) => (
          <div
            key={i}
            style={{
              height: "100vh",
              width: "100vw",
              backgroundColor,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              paddingTop: `${HEADER_HEIGHT + 40}px`,
              paddingLeft: "40px",
              boxSizing: "border-box",
              color: backgroundColor === "green" ? "#fff" : "#000",
            }}
          >
            <motion.h2
              initial={{ y: 200, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ y: 200, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ maxWidth: "600px" }}
            >
              {description}
            </motion.p>
          </div>
        ))}
      </div>

      {/* Gradient Overlay at Bottom */}
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
      {currentSection < sections.length - 1 && (
        <>
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

          {/* Skip Button - Bottom Right */}
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
