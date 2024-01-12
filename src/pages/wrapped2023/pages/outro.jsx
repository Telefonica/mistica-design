import ContentContainer from "../components/content-container";
import { Touchable, Text, useScreenSize, Inline } from "@telefonica/mistica";
import styles from "./outro.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const Outro = () => {
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();

  const button = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="94"
      height="94"
      viewBox="0 0 94 94"
      fill="none"
    >
      <rect x="4" y="5" width="85" height="85" fill="#EAC344" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M88.1721 6.59649H7.36505V87.4035H88.1721V6.59649ZM0.768555 0V94H94.7686V0H0.768555Z"
        fill="black"
      />
      <path d="M11.6152 10.8461H18.846V18.0768H11.6152V10.8461Z" fill="black" />
      <path
        d="M76.6924 10.8461H83.9232V18.0768H76.6924V10.8461Z"
        fill="black"
      />
      <path d="M11.6152 75.9232H18.846V83.154H11.6152V75.9232Z" fill="black" />
      <path d="M76.6924 75.9232H83.9232V83.154H76.6924V75.9232Z" fill="black" />
      <path d="M22.46 21.6925H33.3061V39.7694H22.46V21.6925Z" fill="black" />
      <path d="M54.998 21.6925H65.8442V39.7694H54.998V21.6925Z" fill="black" />
      <path
        d="M29.6914 14.4619H60.4222V21.6927H29.6914V14.4619Z"
        fill="black"
      />
      <path
        d="M47.7666 39.7697H65.8435V47.0004H47.7666V39.7697Z"
        fill="black"
      />
      <path
        d="M42.3447 47.0002H54.9986V59.6541H42.3447V47.0002Z"
        fill="black"
      />
      <path d="M42.3447 66.8851H54.9986V79.539H42.3447V66.8851Z" fill="black" />
    </svg>
  );

  const wall = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="94"
      height="94"
      viewBox="0 0 94 94"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M87.4035 6.59649H6.59649V87.4035H87.4035V6.59649ZM0 0V94H94V0H0Z"
        fill="black"
      />
      <path d="M0 0H94V7.23077H0V0Z" fill="black" />
      <path d="M0 30.7306H94V37.9614H0V30.7306Z" fill="black" />
      <path d="M0 86.7694H94V94.0002H0V86.7694Z" fill="black" />
      <path d="M0 61.4617H94V68.6924H0V61.4617Z" fill="black" />
      <path d="M43.3848 7.23059H50.6155V34.346H43.3848V7.23059Z" fill="black" />
      <path
        d="M43.3848 65.0768H50.6155V92.1922H43.3848V65.0768Z"
        fill="black"
      />
      <path
        d="M21.6934 34.3461H28.9241V61.4615H21.6934V34.3461Z"
        fill="black"
      />
      <path
        d="M65.0771 34.3461H72.3079V61.4615H65.0771V34.3461Z"
        fill="black"
      />
    </svg>
  );

  const explosion = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1535"
      height="1535"
      viewBox="0 0 1535 1535"
      fill="none"
    >
      <circle cx="764.172" cy="767.048" r="156" fill="#FABADA" />
      <circle
        cx="767.172"
        cy="767.048"
        r="410.5"
        stroke="#FABADA"
        stroke-width="141"
      />
      <circle
        cx="767.172"
        cy="767.048"
        r="696.5"
        stroke="#FABADA"
        stroke-width="141"
      />
    </svg>
  );

  const [clickCount, setClickCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);

  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount < 5) {
      confetti({
        particleCount: 150,
        spread: 60,
        shapes: ["circle", "star"],
        colors: ["#E66C64", "#EAC344", "#0066FF"],
      });
    }

    if (newClickCount >= 5) {
      // Navigate to another screen when click count reaches 10
      setTimeout(() => navigate("/wrapped-2023/finale"), 800);
      setShowExplosion(true);
    }

    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <ContentContainer>
      {showExplosion ? (
        <>
          <div className={styles.explosionContent}>
            <Text size={isMobile ? 24 : 80} weight="bold">
              BOOOOOOOOOOM....
            </Text>
          </div>
          <div className={styles.explosion}>{explosion}</div>
        </>
      ) : (
        <>
          <Text size={isMobile ? 24 : 32} weight="bold">
            One more thing...
          </Text>
          <Inline space={8}>
            <Text>Click me!</Text>
            <Text>{clickCount} / 5</Text>
          </Inline>
          <div className={styles.svgContainer}>
            {wall}
            <div
              className={`${styles.bounceContainer} ${
                animate ? styles.bounceAnimation : ""
              }`}
            >
              <Touchable onPress={handleClick} as="button">
                {button}
              </Touchable>
            </div>
            {wall}
          </div>
        </>
      )}
    </ContentContainer>
  );
};

export default Outro;
