import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ScrollDrawSketch = () => {
  const ref = useRef(null);

  // Track scroll inside this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Drawing animation
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0.5, 0.6]);

  return (
    <section ref={ref} style={styles.wrapper}>
      <motion.svg
        viewBox="0 0 1200 300"
        style={styles.svg}
      >
        <motion.path
          d="
            M50 200
            Q 300 50 600 150
            T 1150 140
          "
          fill="none"
          stroke="#3a3a3a"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            pathLength,
            opacity,
          }}
        />
      </motion.svg>
    </section>
  );
};

export default ScrollDrawSketch;

const styles = {
  wrapper: {
    position: "relative",
    height: "300px",
    overflow: "hidden",
    marginTop: "-80px", // pulls under previous section
  },
  svg: {
    width: "100%",
    height: "100%",
    filter: "blur(0.6px)",
  },
};
