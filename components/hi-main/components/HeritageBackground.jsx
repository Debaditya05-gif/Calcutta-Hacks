import { motion, useScroll, useTransform } from "framer-motion";

const HeritageBackground = () => {
    const { scrollY } = useScroll();

    // Parallax effect - background moves slower than scroll
    const y = useTransform(scrollY, [0, 3000], [0, -500]);
    const opacity = useTransform(scrollY, [0, 1500], [0.4, 0.15]);

    return (
        <div style={styles.backgroundContainer}>
            {/* Main heritage sketch background with parallax */}
            <motion.div
                style={{
                    ...styles.imageWrapper,
                    y,
                }}
            >
                <img
                    src="/heritage-sketch.png"
                    alt="Heritage Sketch"
                    style={styles.backgroundImage}
                />
                {/* Repeat image for seamless scrolling */}
                <img
                    src="/heritage-sketch.png"
                    alt="Heritage Sketch"
                    style={styles.backgroundImage}
                />
                <img
                    src="/heritage-sketch.png"
                    alt="Heritage Sketch"
                    style={styles.backgroundImage}
                />
            </motion.div>

            {/* Overlay to blend with content */}
            <motion.div
                style={{
                    ...styles.overlay,
                    opacity,
                }}
            />

            {/* Gradient overlays for smooth blending */}
            <div style={styles.topGradient} />
            <div style={styles.bottomGradient} />

            {/* Floating particles for extra effect */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    style={{
                        ...styles.particle,
                        left: `${(i * 13 + 5) % 100}%`,
                        top: `${(i * 17 + 10) % 100}%`,
                    }}
                    animate={{
                        y: [0, -80, 0],
                        opacity: [0, 0.5, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 6 + (i % 4),
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export default HeritageBackground;

const styles = {
    backgroundContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
        background: "#f5f0e8",
    },

    imageWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },

    backgroundImage: {
        width: "100%",
        height: "auto",
        objectFit: "cover",
        opacity: 0.35,
        filter: "blur(1px) sepia(20%)",
    },

    overlay: {
        position: "absolute",
        inset: 0,
        background: "rgba(255, 250, 245, 0.6)",
        pointerEvents: "none",
    },

    topGradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "200px",
        background: "linear-gradient(to bottom, rgba(255, 250, 245, 0.95), transparent)",
        zIndex: 2,
        pointerEvents: "none",
    },

    bottomGradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "150px",
        background: "linear-gradient(to top, rgba(255, 250, 245, 0.9), transparent)",
        zIndex: 2,
        pointerEvents: "none",
    },

    particle: {
        position: "absolute",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "rgba(139, 90, 43, 0.4)",
        pointerEvents: "none",
        zIndex: 3,
    },
};
