import { jerseys } from "../../data/jerseys";
import styles from "./Hero.module.css";
import JerseyFan from "../JerseyFan/JerseyFan";
import BallonFlip from "../ballonFlipScroll/BallonFlip";
import TestimonialSection from "../testimonials/TestimonialSection";
import Container from "../layout/Container";

function Hero() {
  return (
    <>
      <section className="py-12 md:py-16 lg:py-20">
        <Container>
          <div className={styles.hero}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              FIFA World Cup 2026 — Official kits available now
            </div>
            <h1 className={styles.headline}>
              Wear your nation.
              <br />
              Own the cup.
            </h1>

            <p className={styles.sub}>
              Official-style kits for every 2026 FIFA World Cup nation. Find
              your country's jersey and rep it on match day.
            </p>

            <div className={styles.ctaRow}>
              <button className={styles.btnPrimary}>
                Shop jerseys — from $49
              </button>
              <button className={styles.btnGhost}>Browse all nations</button>
            </div>

            <JerseyFan jerseys={jerseys} />
          </div>
        </Container>

        {/* <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statNum}>48</span>
          <span className={styles.statLabel}>nations</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>96</span>
          <span className={styles.statLabel}>kit designs</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>2026</span>
          <span className={styles.statLabel}>World Cup</span>
        </div>
      </div> */}
      </section>
      {/* BallonFlip component */}
      <section className="relative bg-white">
        <BallonFlip />
      </section>
      <section>
        <TestimonialSection />
      </section>
    </>
  );
}

export default Hero;
