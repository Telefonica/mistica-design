import ColorStar from "../components/color-star";
import styles from "./intro.module.css";
import { Stack, Text5 } from "@telefonica/mistica";
import { Intro as IntroText } from "../data/texts";

const Intro = () => {
  return (
    <>
      <div></div>
      <div className={styles.container}>
        <Stack space={64}>
          <ColorStar />
          <Text5 className={styles.text}>{IntroText}</Text5>
        </Stack>
      </div>
    </>
  );
};

export default Intro;
