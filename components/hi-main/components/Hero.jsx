import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section style={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={styles.content}
      >
        {/* 🔴 Badge */}
        <span style={styles.badge}>AI-Powered Kolkata Heritage Explorer</span>

        {/* 🖤 MAIN HEADING */}
        <h1 style={styles.heading}>
          <span style={styles.headingBold}>Unfold the</span>{" "}
          <span style={styles.headingRed}>City of Joy</span>
        </h1>

        {/* ✨ SUBHEADING */}
        <p style={styles.subheading}>
          Discover heritage, taste the culture, and never wander alone.
        </p>

        {/* 🚀 CTA BUTTONS */}
        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => router.push("/portal")}
          >
            Start Exploring
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Contact Us
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    minHeight: "40vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    padding: "0 60px",
  },

  content: {
    maxWidth: "760px",
    textAlign: "center",
  },

  badge: {
    display: "inline-block",
    background: "#ffd166",
    color: "#000",
    padding: "16px 14px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "18px",
  },

  heading: {
    fontSize: "64px",
    lineHeight: "1.1",
    marginBottom: "20px",
    fontFamily: "'Playfair Display', serif",
  },

  headingBold: {
    fontWeight: "700",
    color: "#111",
  },

  headingRed: {
    fontWeight: "800",
    color: "#d90429",
  },

  subheading: {
    fontSize: "20px",
    color: "#444",
    maxWidth: "640px",
    margin: "0 auto 36px",
    lineHeight: "1.6",
  },

  actions: {
    display: "flex",
    gap: "18px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "#d90429",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  secondaryBtn: {
    background: "#fff",
    color: "#000",
    padding: "14px 26px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
};
