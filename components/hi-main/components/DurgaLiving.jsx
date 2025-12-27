import { motion } from "framer-motion";

const flowers = Array.from({ length: 8 });

const DurgaLiving = () => {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {/* 🌟 TEXT SIDE */}
        <div style={styles.text}>
          <h2 style={styles.title}>মা দুর্গা</h2>
          <p style={styles.desc}>
            The divine force of courage, compassion, and strength —
            watching over the City of Joy.
          </p>
        </div>

        {/* 🌺 DURGA VISUAL */}
        <div style={styles.visual}>
          {/* ✨ AURA */}
          <motion.div
            style={styles.aura}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.85, 0.5],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* 🪔 DURGA IMAGE */}
          <motion.img
            src="/durga.png"
            alt="Durga Thakur"
            style={styles.durga}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 🌸 FLOWERS */}
          {flowers.map((_, i) => (
            <motion.img
              key={i}
              src="/flower.png"
              style={{
                ...styles.flower,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${i * 1.2}s`,
              }}
              animate={{
                y: [0, 320],
                opacity: [0, 1, 0],
                rotate: [0, 20],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DurgaLiving;

/* 🎨 STYLES */
const styles = {
  section: {
    padding: "120px 60px",
    background: "linear-gradient(rgba(255,250,247,0.85), rgba(245,239,230,0.85))",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    gap: "20px",
  },

  text: {
    paddingRight: "40px",
  },

  title: {
    fontSize: "52px",
    marginBottom: "12px",
  },

  desc: {
    fontSize: "18px",
    color: "#555",
    lineHeight: 1.6,
  },

  visual: {
    position: "relative",
    height: "620px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  aura: {
    position: "absolute",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,200,120,0.7) 0%, rgba(255,200,120,0.2) 40%, transparent 70%)",
    filter: "blur(25px)",
    zIndex: 1,
  },

  durga: {
    width: "580px",
    position: "relative",
    zIndex: 2,
  },

  flower: {
    position: "absolute",
    top: "-20px",
    width: "56px",
    opacity: 0,
    zIndex: 3,
    pointerEvents: "none",
  },
};
