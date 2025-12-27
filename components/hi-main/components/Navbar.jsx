import { useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 👉 Detect explore page
  const isExplorePage = pathname === "/explore";

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/song.mp3");
    }

    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.5;
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <header style={styles.header}>
      {/* LOGO (CLICK → HOME) */}
      <div
        style={{ ...styles.logo, cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        <img src="/logo.png" alt="Kol-Kotha" style={styles.logoImg} />
        <div>
          <h2 style={{ color: "#d90429", margin: 0 }}>Kol-Kotha</h2>
          <small>Explore · Discover · Connect</small>
        </div>
      </div>

      {/* MENU */}
      <ul style={styles.menu}>
        <li>About</li>
        <li>Features</li>
        <li style={{ color: "#d90429" }}>Events</li>
      </ul>

      {/* ACTIONS */}
      <div style={styles.actions}>
        {/* SHOW ONLY ON HOME PAGE */}
        {!isExplorePage && (
          <button style={styles.cta} onClick={() => router.push("/login")}>
            Get Started
          </button>
        )}

        <button
          onClick={toggleMusic}
          style={styles.musicBtn}
          title={playing ? "Mute Music" : "Play Music"}
        >
          {playing ? <FiVolume2 /> : <FiVolumeX />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;

/* ================= STYLES ================= */

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 60px",
    background: "#fffaf7",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoImg: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
  },

  menu: {
    display: "flex",
    gap: "28px",
    listStyle: "none",
    fontWeight: 500,
    cursor: "pointer",
    margin: 0,
    padding: 0,
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  cta: {
    background: "#d90429",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
  },

  musicBtn: {
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: "8px",
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: "20px",
  },
};
