import { motion, useAnimation, useInView } from "framer-motion";
import React, { useEffect } from "react";

const Reveal = ({ children }) => {
  const inViewRef = React.useRef(null);
  const inView = useInView(inViewRef);
  const mainControls = useAnimation();

  useEffect(() => {
    if (inView) {
      mainControls.start("visible");
    } else {
      mainControls.start("hidden");
    }
  }, [inView, mainControls]);

  return (
    <div ref={inViewRef} style={{ position: "relative" }}>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            scale: 0.8,
            y: 400,
            zIndex: 10,
          },
          visible: {
            opacity: 1,
            scale: 1,
            y: 100,
          },
        }}
        initial="hidden"
        animate={mainControls}
        exit="hidden"
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;
