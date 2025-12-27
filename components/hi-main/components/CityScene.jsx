import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";

const CityScene = () => {
  const ref = useRef(null);
  const [night, setNight] = useState(false);

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 🚕 Taxi movement on scroll
  const taxiX = useTransform(
    scrollYProgress,
    [0, 1],
    ["-200px", "820px"]
  );

  return (
    <section ref={ref} style={styles.section}>
      <motion.div
        style={styles.box}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* 🌞🌙 DAY / NIGHT TOGGLE */}
        <div style={styles.toggleWrapper}>
          <div
            style={{
              ...styles.toggle,
              background: night ? "#ffd60a" : "#ccc",
            }}
            onClick={() => setNight(!night)}
          >
            <motion.div
              layout
              style={{
                ...styles.knob,
                background: night ? "#0b132b" : "#fff",
              }}
            />
          </div>
        </div>

        {/* 🎬 SCENE */}
        <div style={styles.scene}>
          {/* 🌉 BRIDGE */}
          <AnimatePresence mode="wait">
            <motion.img
              key={night ? "night" : "day"}
              src={night ? "/howrah-night.png" : "/howrah-day.png"}
              alt="Howrah Bridge"
              style={styles.bridge}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>

          {/* 🛣️ ROAD */}
          <div style={styles.road} />

          {/* 🚕 TAXI + 🎏 SASH (ONE UNIT) */}
          <motion.div
            style={{
              ...styles.taxiWrapper,
              x: taxiX,
            }}
          >
            {/* 🎏 SASH */}
            <motion.div
              style={styles.sash}
              animate={{ rotate: [0, -2, 2, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
            >
              <span style={styles.sashText}>কলকাতা</span>
              <div style={styles.sashTail} />
            </motion.div>

            {/* 💡 HEADLIGHT (NIGHT ONLY) */}
            {night && (
              <motion.div
                style={styles.headlight}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}

            {/* 🚕 TAXI */}
            <img src="/taxi.png" alt="Taxi" style={styles.taxi} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CityScene;

/* ================= STYLES ================= */

const styles = {
  section: {
    padding: "60px",
    background: "transparent",
    minHeight: "100vh", // creates scroll
  },

  box: {
    position: "relative",
    width: "100%",
    height: "420px",
    borderRadius: "22px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
  },

  /* Toggle */
  toggleWrapper: {
    position: "absolute",
    top: "18px",
    right: "18px",
    zIndex: 30,
  },
  toggle: {
    width: "52px",
    height: "26px",
    borderRadius: "20px",
    padding: "3px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  knob: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
  },

  scene: {
    position: "relative",
    width: "100%",
    height: "100%",
  },

  bridge: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  /* ROAD */
  road: {
    position: "absolute",
    left: 0,
    bottom: "0px",
    width: "100%",
    height: "52px",
    background: "#2b2b2b",
    zIndex: 5,
  },

  /* TAXI + SASH */
  taxiWrapper: {
    position: "absolute",
    bottom: "12px", // perfectly on road
    left: 0,
    display: "flex",
    alignItems: "center",
    gap: "0px", // ❌ no gap
    zIndex: 10,
  },

  taxi: {
    width: "280px",
    display: "block",
  },

  /* 🎏 SASH */
  sash: {
    background: "#d90429",
    padding: "4px 14px 4px 6px",
    borderRadius: "3px 0 0 3px",
    display: "flex",
    alignItems: "center",
    position: "relative",
    top: "15px",   // ⬇️ moves ribbon DOWN slightly
    left: "-6px",
  },

  sashText: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "1px",
    fontFamily: "'Noto Serif Bengali', serif",
  },

  sashTail: {
    position: "absolute",
    right: "-12px",
    top: 0,
    width: "12px",
    height: "100%",
    background: "#b50320",
    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
  },

  /* 💡 HEADLIGHT */
  headlight: {
    position: "absolute",
    right: "-18px",
    top: "50%",
    transform: "translateY(-50%) skewX(-12deg)",
    width: "120px",
    height: "42px",
    background:
      "radial-gradient(circle, rgba(255,255,200,0.7), transparent 70%)",
    filter: "blur(8px)",
    pointerEvents: "none",
  },
};
