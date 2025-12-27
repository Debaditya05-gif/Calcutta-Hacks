import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const pages = [
  "/newspaper.png",
  "/newspaper-page2.png",
  "/newspaper-page3.png",
];

const Newspaper = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const nextPage = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
    } else {
      setOpen(false);
      setPage(0);
    }
  };

  return (
    <>
      {/* 📰 FLOATING STAND */}
      <div style={styles.standWrapper}>
        <img
          src="/stand.png"
          alt="Newspaper Stand"
          style={styles.stand}
          onClick={() => setOpen(true)}
        />
        <p style={styles.hint}>Click to read today’s news</p>
      </div>

      {/* 🗞️ NEWSPAPER OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              key={page}
              src={pages[page]}
              alt="Newspaper Page"
              style={styles.paper}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.6 }}
              onClick={nextPage}
            />

            <p style={styles.pageHint}>Click page to turn</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Newspaper;

/* ===================== STYLES ===================== */

const styles = {
  standWrapper: {
    position: "fixed",
    right: "40px",
    bottom: "80px",
    zIndex: 40,
    textAlign: "center",
    cursor: "pointer",
  },

  stand: {
    width: "120px",
    animation: "float 3s ease-in-out infinite",
  },

  hint: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#555",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    perspective: "1200px",
  },

  paper: {
    width: "420px",
    borderRadius: "6px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    cursor: "pointer",
    background: "#fff",
  },

  pageHint: {
    marginTop: "12px",
    color: "#fff",
    fontSize: "14px",
  },
};
