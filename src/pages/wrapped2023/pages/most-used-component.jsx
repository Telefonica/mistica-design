import SectionTitle from "../components/section-title";
import { useScreenSize, Stack, Text8, Text5 } from "@telefonica/mistica";
import { Components } from "../data/figmaData";
import styles from "./most-used-component.module.css";
import { formatCount } from "../utils";
import {
  mostUsedComponentTitle,
  mostUsedComponentSubtitle,
  mostUsedComponentPretitle,
} from "../data/texts";

const MostUsedComponent = () => {
  const { isMobile } = useScreenSize();
  const { componentWithHighestCount } = Components();

  return (
    <div className={styles.container}>
      <Stack space={64}>
        <Stack space={0}>
          <SectionTitle
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="311"
                height="113"
                viewBox="0 0 311 113"
                fill="none"
              >
                <path
                  d="M48.8735 70.9802H46.9135L79.2535 105H56.0135L24.6535 71.4002H19.6135V105H0.853516V7.00018H46.0735C63.7135 7.00018 76.7335 20.3002 76.7335 39.6202C76.7335 57.8202 63.9935 70.9802 48.8735 70.9802ZM19.6135 24.5002V54.3202H45.2335C52.2335 54.3202 58.1135 48.3002 58.1135 39.4802C58.1135 30.5202 52.2335 24.5002 45.2335 24.5002H19.6135Z"
                  fill="#E3B315"
                />
                <path
                  d="M118.378 106.4C97.658 106.4 82.258 90.8602 82.258 69.5802C82.258 48.1602 97.658 32.6202 118.378 32.6202C138.958 32.6202 154.498 48.1602 154.498 69.5802C154.498 90.8602 138.958 106.4 118.378 106.4ZM118.378 90.0202C128.458 90.0202 136.858 81.9002 136.858 69.5802C136.858 57.1202 128.458 49.0002 118.378 49.0002C108.158 49.0002 99.758 57.1202 99.758 69.5802C99.758 81.9002 108.158 90.0202 118.378 90.0202Z"
                  fill="#E3B315"
                />
                <path
                  d="M243.379 63.0002C231.759 78.2602 244.919 85.2602 249.819 85.5402C315.199 88.9002 307.919 40.6002 295.739 30.1002C289.299 24.5002 278.939 27.4402 272.919 36.1202L272.219 35.8402L294.899 0.840184C331.439 15.2602 297.139 104.86 262.559 104.58C245.059 104.44 231.479 81.3402 239.179 56.7002L242.399 46.4802C234.699 67.0602 220.559 94.9202 192.839 101.92L177.439 105.84C176.319 107.66 179.259 111.44 176.879 112.28C174.919 112.84 173.379 110.18 174.779 107.66L190.039 81.0602L197.879 80.0802C207.399 65.9402 215.519 52.2202 215.519 33.7402C215.519 9.52018 194.519 3.08018 175.899 15.2602C157.139 27.4402 158.259 57.2602 183.879 56.4202C194.099 56.1402 206.279 42.9802 211.879 33.0402L212.719 33.8802C207.539 42.4202 194.939 56.9802 186.399 63.9802C175.199 73.0802 155.039 70.1402 156.019 46.7602C156.719 30.9402 165.399 20.8602 178.839 11.3402C194.659 0.000178337 233.719 -8.95982 233.719 20.1602C233.719 43.1202 214.819 61.4602 199.979 79.8002C223.079 76.3002 238.059 64.6802 248.139 24.9202L249.959 24.7802V24.9202L272.779 24.3602L243.379 63.0002Z"
                  fill="#E3B315"
                />
              </svg>
            }
            pretitle={mostUsedComponentPretitle}
            title={mostUsedComponentTitle}
            subtitle={mostUsedComponentSubtitle}
          />
        </Stack>
        <ul className={styles.list}>
          <li>
            <Text8 weight="bold">
              {formatCount(componentWithHighestCount.count)}
            </Text8>
            <Text5>instances in Figma</Text5>
          </li>
          <li>
            {" "}
            <Text5>Used by</Text5>
            <Text8 weight="bold">{componentWithHighestCount.usedBy}</Text8>{" "}
            <Text5>teams</Text5>{" "}
          </li>
          <li>
            <Text8 weight="bold">
              {componentWithHighestCount.percentageChange}
            </Text8>
            <Text5>from last year</Text5>
          </li>
        </ul>
      </Stack>
    </div>
  );
};

export default MostUsedComponent;
