import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();

  // ✅ HANDLE LOGIN / SIGNUP
  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 Fake success login (perfect for hackathon)
    navigate("/explore");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* 🔙 BACK BUTTON */}
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back
        </button>

        {/* TABS */}
        <div style={styles.tabs}>
          <button
            onClick={() => setIsSignup(false)}
            style={{
              ...styles.tab,
              background: !isSignup ? "#d90429" : "#fff",
              color: !isSignup ? "#fff" : "#000",
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => setIsSignup(true)}
            style={{
              ...styles.tab,
              background: isSignup ? "#d90429" : "#fff",
              color: isSignup ? "#fff" : "#000",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            required
          />

          <button type="submit" style={styles.mainBtn}>
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <p style={styles.or}>OR CONTINUE WITH</p>

        <button
          style={styles.googleBtn}
          onClick={() => navigate("/explore")} // fake Google success
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            width="18"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fffaf7",
  },
  card: {
    width: "360px",
    padding: "24px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    top: "14px",
    left: "14px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: "#333",
  },
  tabs: {
    display: "flex",
    marginBottom: "20px",
    borderRadius: "8px",
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    padding: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  mainBtn: {
    marginTop: "10px",
    padding: "12px",
    background: "#d90429",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  or: {
    textAlign: "center",
    margin: "16px 0",
    fontSize: "12px",
    color: "#777",
  },
  googleBtn: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
  },
};

