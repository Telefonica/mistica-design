import { useEffect } from "react";
import styles from "./github-contributors.module.css";
import SectionContainer from "../components/section-container";
import { useScreenSize, Inline, Text } from "@telefonica/mistica";
import DataBox from "../components/data-box";
import ContentContainer from "../components/content-container";
import List from "../components/list";
import { contributors } from "../data/devData";

const GitHubContributors = () => {
  const { isMobile } = useScreenSize();

  const MobileBackground = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="125vw"
      height="auto"
      viewBox="0 0 375 667"
      fill="transparent"
    >
      <path
        d="M166.37 777.123C280.877 571.985 569.7 257.904 509.89 161.708C450.08 65.5115 104.269 535.942 -13.0599 488.534C-130.389 441.125 266.733 -34.65 323.721 -191"
        stroke="url(#paint0_linear_878_5623)"
        stroke-width="16"
        stroke-linecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_878_5623"
          x1="166.37"
          y1="777.123"
          x2="-211.663"
          y2="459.916"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FEBE58" />
          <stop offset="1" stop-color="#DE2BAE" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <ContentContainer>
      <div className={styles.contributors}>
        <div className={styles.titleSize}>
          <Text size={isMobile ? 18 : 32}>
            This has been the year of contributions and some of you have reached
            the top:
          </Text>
        </div>
        <List content={contributors}></List>
      </div>
      <div className={styles.mobileBackground}>{MobileBackground}</div>
    </ContentContainer>
  );
};

export default GitHubContributors;
