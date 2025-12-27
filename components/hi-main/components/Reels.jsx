import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  // Fetch reels (backend optional)
  useEffect(() => {
    fetch("http://localhost:5000/api/reels")
      .then((res) => res.json())
      .then((data) => setReels(data))
      .catch(() => setReels([]));
  }, []);

  const nextReel = () => {
    if (index < reels.length - 1) {
      setIndex(index + 1);
    } else {
      setOpen(false);
      setIndex(0);
    }
  };

  return (
    <>
      {/* 🎬 FLOATING CLAPPER IMAGE ICON */}
      <motion.div
        style={styles.stand}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
      >
        <img src="/clapper.png" alt="Reels" style={styles.icon} />
        <p style={styles.label}></p>
      </motion.div>

      {/* 🎥 REELS VIEWER */}
      <AnimatePresence>
        {open && reels.length > 0 && (
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.video
              key={index}
              src={reels[index].video}
              autoPlay
              loop
              playsInline
              style={styles.video}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.4 }}
              onClick={nextReel}
            />

            <p style={styles.caption}>
              {reels[index].title}
              <br />
              <span style={styles.hint}>Tap to watch next</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Reels;

/* ================= STYLES ================= */

const styles = {
  stand: {
    position: "fixed",
    left: "40px",
    bottom: "80px",
    zIndex: 9999, // 🔥 VERY IMPORTANT
    cursor: "pointer",
    textAlign: "center",
  },

  icon: {
    width: "150px",
    height: "156px",
    objectFit: "contain",
  },

  label: {
    fontSize: "12px",
    marginTop: "6px",
    color: "#444",
    fontWeight: 500,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },

  video: {
    width: "320px",
    height: "560px",
    borderRadius: "18px",
    objectFit: "cover",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    cursor: "pointer",
  },

  caption: {
    color: "#fff",
    marginTop: "12px",
    textAlign: "center",
    fontSize: "14px",
  },

  hint: {
    fontSize: "12px",
    opacity: 0.6,
  },
};
