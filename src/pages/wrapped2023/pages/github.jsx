import { useEffect } from "react";
import styles from "./github.module.css";
import SectionContainer from "../components/section-container";
import { useScreenSize, Inline, Text } from "@telefonica/mistica";
import DataBox from "../components/data-box";
import ContentContainer from "../components/content-container";
import List from "../components/list";
import { contributors } from "../data/devData";

const GitHub = () => {
  const { isMobile } = useScreenSize();

  useEffect(() => {
    const sticky = document.querySelector(`.${styles.content}`);
    const scrollSection = document.querySelector(`.${styles.scroll}`);

    const handleScroll = () => {
      const offsetTop = sticky.closest(`.sticky`).offsetTop;

      // Calculate scroll percentage relative to the top and bottom of the section
      let scrollPercentage =
        ((window.scrollY - offsetTop) / window.innerHeight) * 100;

      scrollPercentage =
        scrollPercentage < 0
          ? 0
          : scrollPercentage > 100
          ? 100
          : scrollPercentage;

      // Use transform property for horizontal scrolling
      scrollSection.style.transform = `translate3d(${
        scrollPercentage * -1
      }vw, 0, 0)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [!isMobile]); // Empty dependency array means the effect runs once when the component mounts

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 437 848"
      fill="none"
    >
      <path
        d="M85.2 791.86L71.62 791.86L71.62 749.58L123 749.58L123 763.72L111.8 765.12L111.8 765.82C117.82 770.72 124.4 781.08 124.4 794.38C124.4 820.98 103.68 841.98 74 841.98C44.32 841.98 23.6 820.7 23.6 794.38C23.6 770.3 40.68 754.9 57.2 750.28L57.2 769.6C48.38 773.66 41.52 783.04 41.52 794.38C41.52 810.48 54.26 823.22 74 823.22C93.74 823.22 106.48 810.48 106.48 794.38C106.48 778.98 95.14 769.18 85.9 768.34L85.2 768.2L85.2 791.86ZM123 716.443L123 735.203L25 735.203L25 716.443L123 716.443ZM123 659.704L123 678.464L42.92 678.464L42.92 707.304L25 707.304L25 630.864L42.92 630.864L42.92 659.704L123 659.704ZM123 576.875L123 595.635L25 595.635L25 576.875L64.2 576.875L64.2 533.475L25 533.475L25 514.855L123 514.855L123 533.475L83.1 533.475L83.1 576.875L123 576.875ZM124.4 459.183C124.4 483.263 108.3 499.503 83.1 499.503L25 499.503L25 480.883L83.1 480.883C96.82 480.883 106.48 471.363 106.48 459.183C106.48 447.003 96.82 437.483 83.1 437.483L25 437.483L25 418.863L83.1 418.863C108.3 418.863 124.4 435.103 124.4 459.183ZM123 356.288L123 403.468L25 403.468L25 357.688C25 341.168 36.48 329.688 52.3 329.688C62.8 329.688 70.5 335.708 73.3 340.188L74 340.188C76.8 335.008 84.64 328.288 95.7 328.288C111.52 328.288 123 339.768 123 356.288ZM41.52 384.708L65.88 384.708L65.88 360.068C65.88 353.488 60.7 348.308 53.7 348.308C46.7 348.308 41.52 353.488 41.52 360.068L41.52 384.708ZM82.12 384.708L106.48 384.708L106.48 358.668C106.48 352.088 101.3 346.908 94.3 346.908C87.3 346.908 82.12 352.088 82.12 358.668L82.12 384.708ZM267.4 794.52C267.4 820.98 246.68 841.98 217 841.98C187.32 841.98 166.6 820.98 166.6 794.52C166.6 769.18 185.22 754.06 202.72 750.28L202.72 769.18C193.48 771.98 184.52 780.8 184.52 794.52C184.52 810.48 197.4 823.22 217 823.22C236.6 823.22 249.48 810.48 249.48 794.52C249.48 780.38 240.24 771.84 230.58 769.18L230.58 750.28C248.5 753.92 267.4 768.76 267.4 794.52ZM267.4 696.454C267.4 722.914 246.68 743.914 217 743.914C187.32 743.914 166.6 722.914 166.6 696.454C166.6 670.134 187.32 649.134 217 649.134C246.68 649.134 267.4 670.134 267.4 696.454ZM249.48 696.454C249.48 680.634 236.6 667.754 217 667.754C197.4 667.754 184.52 680.634 184.52 696.454C184.52 712.414 197.4 725.154 217 725.154C236.6 725.154 249.48 712.414 249.48 696.454ZM266 618.377L266 637.137L168 637.137L168 607.457L237.02 584.357L237.02 581.557L168 558.457L168 528.777L266 528.777L266 547.537L198.1 547.537L198.1 550.337L266 573.157L266 592.757L198.1 615.577L198.1 618.377L266 618.377ZM266 493.788L266 512.548L168 512.548L168 482.868L237.02 459.768L237.02 456.968L168 433.868L168 404.188L266 404.188L266 422.948L198.1 422.948L198.1 425.748L266 448.568L266 468.168L198.1 490.988L198.1 493.788L266 493.788ZM267.4 348.479C267.4 372.559 251.3 388.799 226.1 388.799L168 388.799L168 370.179L226.1 370.179C239.82 370.179 249.48 360.659 249.48 348.479C249.48 336.299 239.82 326.779 226.1 326.779L168 326.779L168 308.159L226.1 308.159C251.3 308.159 267.4 324.399 267.4 348.479ZM266 274.004L266 292.764L168 292.764L168 268.264L235.48 232.984L235.48 230.184L168 230.184L168 211.564L266 211.564L266 236.064L198.52 271.204L198.52 274.004L266 274.004ZM266 176.486L266 195.246L168 195.246L168 176.486L266 176.486ZM266 119.747L266 138.507L185.92 138.507L185.92 167.347L168 167.347L168 90.9074L185.92 90.9074L185.92 119.747L266 119.747ZM266 39.1292L266 57.7492L232.68 57.7492L168 93.4492L168 72.7292L210.28 49.7692L210.28 46.9692L168 24.1492L168 3.42918L232.68 39.1292L266 39.1292Z"
        fill="black"
      />
      <path
        d="M412 802.5L412 837.78L314 837.78L314 802.5C314 775.62 334.72 755.18 363 755.18C391.28 755.18 412 775.62 412 802.5ZM331.92 819.02L394.08 819.02L394.08 802.5C394.08 786.4 381.48 773.8 363 773.8C344.52 773.8 331.92 786.4 331.92 802.5L331.92 819.02ZM328.84 670.756C340.46 672.576 375.6 684.196 389.04 687.696C404.02 691.476 411.58 690.636 412.7 686.436C415.36 676.636 385.54 672.296 384.84 679.576C384.56 681.816 384.84 683.076 388.06 685.736L387.5 686.296C378.54 679.996 369.16 667.676 372.38 662.216C380.22 649.056 414.8 668.516 414.8 687.976C414.8 695.816 408.64 705.336 401.5 709.116L343.68 688.676L343.68 690.216C387.78 704.776 416.48 720.456 416.48 731.376C416.48 747.756 404.3 754.896 393.66 754.896C360.76 754.896 332.62 683.356 312.04 682.796C309.52 682.796 308.82 683.776 308.82 685.456C308.68 696.236 347.04 721.296 347.04 735.436C347.04 742.436 338.5 745.796 332.2 745.796C322.4 745.796 313.44 743.416 309.52 741.036L309.94 740.756C320.16 745.376 324.64 738.236 324.64 731.656C324.64 711.916 307 698.196 307 683.216C307 676.216 313.02 668.376 328.84 670.756ZM324.36 686.156L323.66 686.856C347.88 710.096 358.1 732.636 383.58 733.756C389.88 734.036 394.08 731.236 394.08 725.216C394.08 706.316 354.46 695.116 324.36 686.156ZM412 611.853L412 630.613L331.92 630.613L331.92 659.453L314 659.453L314 583.013L331.92 583.013L331.92 611.853L412 611.853ZM412 496.315L412 516.615L390.58 523.895L390.58 565.335L412 572.615L412 592.915L314 558.195L314 531.175L412 496.315ZM333.88 546.015L373.92 559.595L373.92 529.635L333.88 543.215L333.88 546.015Z"
        fill="black"
      />
    </svg>
  );

  const MobileBackground = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="125vw"
      height="auto"
      viewBox="0 0 375 667"
      fill="none"
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

  const desktopBackground = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="500vw"
      height="100%"
      viewBox="0 0 4344 1024"
      fill="none"
    >
      <rect width="auto" height="100%" fill="transparent" />
      <g>
        <path
          d="M1036.85 2037.27C1499.85 1207.8 2667.69 -62.1618 2425.86 -451.127C2184.02 -840.091 785.749 1062.07 311.336 870.375C-163.076 678.682 1010.26 -473.835 1240.68 -1106.03"
          stroke="url(#paint0_linear_924_1614)"
          stroke-width="22.4498"
          stroke-linecap="round"
        />
        <path
          d="M-107.902 727.953C193.375 1036.7 252.299 1722.77 795.929 1654.18C1339.56 1585.59 943.655 721.136 1522.99 522.188C2102.32 323.241 2196.95 878.956 2533.93 1057.34"
          stroke="url(#paint1_linear_924_1614)"
          stroke-width="22.4498"
          stroke-linecap="round"
        />
        <path
          d="M3110.08 -424.614C2999.23 -13.6618 2451.45 402.468 2777.53 808.242C3103.6 1214.02 3634.99 427.821 4088.3 792.708C4541.6 1157.6 4121.06 1532.84 4137.45 1902.9"
          stroke="url(#paint2_linear_924_1614)"
          stroke-width="22.4498"
          stroke-linecap="round"
        />
      </g>

      <defs>
        <linearGradient
          id="paint0_linear_924_1614"
          x1="1036.85"
          y1="2037.27"
          x2="-491.703"
          y2="754.66"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FEBE58" />
          <stop offset="1" stop-color="#DE2BAE" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_924_1614"
          x1="-107.902"
          y1="727.953"
          x2="2325.64"
          y2="161.898"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FEBE58" />
          <stop offset="1" stop-color="#DE2BAE" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_924_1614"
          x1="3110.08"
          y1="-424.614"
          x2="4787.52"
          y2="1252.83"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FEBE58" />
          <stop offset="1" stop-color="#DE2BAE" />
        </linearGradient>
        <clipPath id="clip0_924_1614">
          <rect width="4344" height="1024" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <SectionContainer height={isMobile ? "100%" : "200vh"}>
      {isMobile ? (
        <>
          <ContentContainer>
            <DataBox
              title="GitHub"
              content={[
                { title: "394", description: "Created issues" },
                { title: "268", description: "Closed issues" },
                { title: "17", description: "Contributors" },
              ]}
              description="GitHub"
            ></DataBox>
            <div className={styles.mobileBackground}>{MobileBackground}</div>
          </ContentContainer>
        </>
      ) : (
        <div className={styles.content}>
          <div className={styles.scroll}>
            {svg}
            <DataBox
              align="start"
              title="GitHub"
              content={[{ title: "394", description: "Created issues" }]}
            ></DataBox>
            <DataBox
              align="center"
              title="GitHub"
              content={[{ title: "268", description: "Closed issues" }]}
            ></DataBox>
            <DataBox
              align="start"
              title="GitHub"
              content={[{ title: "17", description: "Contributors" }]}
            ></DataBox>
            <div className={styles.contributors}>
              <Text size={isMobile ? 18 : 32}>
                This has been the year of contributions and some of you have
                reached the top:
              </Text>
              <List content={contributors}></List>
            </div>
          </div>
          <div className={styles.desktopBackground}>{desktopBackground}</div>
        </div>
      )}
    </SectionContainer>
  );
};

export default GitHub;
