import { useEffect, useRef } from "react";
import Reels from "./Reels";
import Newspaper from "./Newspaper";

const Explore = () => {
  const welcomeAudio = useRef(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!hasPlayed.current) {
      hasPlayed.current = true;

      welcomeAudio.current.volume = 0.8;
      welcomeAudio.current.play().catch(() => {
        // Autoplay may be blocked – acceptable for demo
      });
    }
  }, []);

  return (
    <div style={styles.page}>
      {/* 🔊 WELCOME AUDIO */}
      <audio ref={welcomeAudio} src="/nomoskar-kolkata.mp3" />

      {/* 🌟 HEADER */}
      <section style={styles.hero}>
        <h1 style={styles.heading}>Explore Kolkata</h1>
        <p style={styles.text}>
          Experience heritage, culture, stories, and the soul of the City of Joy.
        </p>
      </section>
       <Reels />

      {/* 📰 NEWSPAPER SECTION */}
      <Newspaper />


    </div>
  );
};

export default Explore;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fffaf7",
  },

  hero: {
    padding: "120px 60px 80px",
    textAlign: "center",
  },

  heading: {
    fontSize: "48px",
    marginBottom: "12px",
  },

  text: {
    fontSize: "18px",
    color: "#555",
    maxWidth: "720px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
};
