import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section id="contact" style={styles.section}>
      <motion.div
        style={styles.container}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* LEFT CONTENT */}
        <div style={styles.left}>
          <h2 style={styles.heading}>
            Contact <span style={{ color: "#d90429" }}>Us</span>
          </h2>

          <p style={styles.text}>
            Have questions about Kolkata’s heritage, culture, or events?
            We’d love to hear from you.
          </p>

          <p style={styles.bengali}>
            কলকাতার ঐতিহ্য ও সংস্কৃতি সম্পর্কে জানতে আমাদের সাথে যোগাযোগ করুন।
          </p>

          <div style={styles.info}>
            <p>📍 Kolkata, West Bengal</p>
            <p>📧 hello@kolkotha.in</p>
            <p>📞 +91 9XXXX XXXXX</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <motion.form
          style={styles.form}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Your Name"
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            style={styles.input}
            required
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            style={styles.textarea}
            required
          />
          <button style={styles.button}>Send Message</button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Contact;

/* ================= STYLES ================= */

const styles = {
  section: {
    padding: "120px 60px",
    background: "rgba(255,250,247,0.85)",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
  },

  left: {},

  heading: {
    fontSize: "42px",
    marginBottom: "16px",
  },

  text: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "16px",
    lineHeight: 1.6,
  },

  bengali: {
    fontSize: "15px",
    color: "#333",
    marginBottom: "24px",
    fontFamily: "'Noto Serif Bengali', serif",
  },

  info: {
    fontSize: "15px",
    lineHeight: 1.8,
    color: "#222",
  },

  form: {
    background: "#fff",
    padding: "32px",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  textarea: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "none",
  },

  button: {
    marginTop: "10px",
    background: "#d90429",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

