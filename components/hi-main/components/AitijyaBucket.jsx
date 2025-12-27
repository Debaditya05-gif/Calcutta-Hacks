import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const items = [
  {
    img: "/victoria.jpg",
    title: "Victoria Memorial",
    desc: "The pride of Kolkata, a monument standing tall since 1921.",
  },
  {
    img: "/tram.jpg",
    title: "Kolkata Tram",
    desc: "The iconic heritage ride through the streets of the city.",
  },
  {
    img: "/rosogolla.jpg",
    title: "Bengali Rosogolla",
    desc: "The sweetness that defines Bengali culture and hospitality.",
  },
  {
    img: "/hand rickshaw.jpg",
    title: "Hand Rickshaw",
    desc: "A living heritage, carrying stories of old Calcutta.",
  },
  {
    img: "/howrah-day.png",
    title: "Howrah Bridge",
    desc: "The gateway to Kolkata, spanning the mighty Hooghly.",
  },
  {
    img: "/p2.png",
    title: "City Spirit",
    desc: "The vibrant soul of the City of Joy.",
  },
];

const AitijyaBucket = () => {
  const [active, setActive] = useState(null);

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>কলকাতার ঐতিহ্য</h2>
      <p style={styles.subtitle}>
        Faces, places, and memories that define the City of Joy.
      </p>

      {/* 🪣 BUCKET */}
      <div style={styles.bucket}>
        {items.map((item, i) => (
          <motion.img
            key={i}
            src={item.img}
            alt={item.title}
            style={{
              ...styles.photo,
              transform: `rotate(${i % 2 === 0 ? -4 : 4}deg)`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive(item)}
          />
        ))}
      </div>

      {/* 🔍 POPUP WITH DETAILS */}
      <AnimatePresence>
        {active && (
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              style={styles.popupCard}
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={active.img} style={styles.popupImg} />
              <h3 style={styles.popupTitle}>{active.title}</h3>
              <p style={styles.popupDesc}>{active.desc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AitijyaBucket;

/* 🎨 STYLES */
const styles = {
  section: {
    padding: "100px 60px",
    background: "rgba(255,250,247,0.8)",
    textAlign: "center",
  },
  title: {
    fontSize: "40px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#555",
    marginBottom: "40px",
  },

  bucket: {
    margin: "0 auto",
    maxWidth: "900px",
    padding: "40px",
    borderRadius: "28px",
    background: "#fff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    justifyContent: "center",
  },

  photo: {
    width: "160px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  popupCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "20px",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },

  popupImg: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    borderRadius: "14px",
    marginBottom: "14px",
  },

  popupTitle: {
    fontSize: "22px",
    marginBottom: "6px",
  },

  popupDesc: {
    fontSize: "14px",
    color: "#555",
  },
};
