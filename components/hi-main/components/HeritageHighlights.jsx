const data = [
  {
    img: "/tram.jpg",
    title: "Historic Trams",
    subtitle: "First in Asia",
  },
  {
    img: "/rosogolla.jpg",
    title: "Rosogollas",
    subtitle: "City Symbol",
  },
  {
    img: "/hand rickshaw.jpg",
    title: "Hand Rickshaws",
    subtitle: "Iconic Rides",
  },
  {
    img: "/victoria.jpg",
    title: "Victoria Memorial",
    subtitle: "Engineering Marvel",
  },
];

const HeritageHighlights = () => {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {data.map((item, i) => (
          <div key={i} style={styles.card}>
            <img src={item.img} alt={item.title} style={styles.icon} />
            <h3 style={styles.title}>{item.title}</h3>
            <p style={styles.subtitle}>{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeritageHighlights;

/* 🎨 STYLES */
const styles = {
  section: {
    padding: "60px 60px",
    background:
      "linear-gradient(180deg, rgba(247,230,195,0.85) 0%, rgba(243,225,181,0.85) 100%)",
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "90px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    background: "#f5e2bb",
    border: "2px solid #5a3e1b",
    padding: "6px 20px",
    textAlign: "center",
    boxShadow: "4px 4px 0 rgba(0,0,0,0.25)",
  },

  icon: {
    width: "180px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "3px solid #5a3e1b",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    marginBottom: "14px",
  },

  title: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "4px",
    fontFamily: "serif",
  },

  subtitle: {
    fontSize: "14px",
    fontStyle: "italic",
    color: "#4a3518",
  },
};
