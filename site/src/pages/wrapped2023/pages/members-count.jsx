import styles from "./members-count.module.css";
import { Circle } from "../components/teams-svg";
import {
  Stack,
  Text,
  useScreenSize,
  ThemeVariant,
  Text3,
} from "@telefonica/mistica";
import { members } from "../data/texts";
import { teamsMembers } from "../data/teamsData";
import SectionTitle from "../components/section-title";
import { Ovni } from "../components/ovni-svg";
import ContentContainer from "../components/content-container";

const Members = () => {
  const { isMobile } = useScreenSize();

  const planets = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      maxWidth="2308"
      height="1348"
      viewBox="0 0 2308 1348"
      fill="none"
    >
      <path
        d="M2192.59 922.035C2176.87 980.562 2132.89 1029.44 2066.72 1067.7C2000.54 1105.96 1912.21 1133.58 1807.88 1149.59C1599.23 1181.6 1326.7 1167.15 1039.76 1098.64C752.815 1030.12 505.839 920.524 338.492 798.73C254.818 737.833 191.072 673.903 152.185 610.555C113.3 547.21 99.2912 484.484 115.01 425.957C130.728 367.43 174.71 318.551 240.883 280.291C307.059 242.03 395.391 214.412 499.719 198.406C708.373 166.393 980.904 180.839 1267.85 249.354C1554.79 317.868 1801.76 427.468 1969.11 549.261C2052.78 610.159 2116.53 674.089 2155.42 737.436C2194.3 800.782 2208.31 863.507 2192.59 922.035Z"
        stroke="#D1D5E4"
      />
      <path
        d="M653.963 842.468C633.903 844.171 622.379 845.738 615.303 850.915C606.988 856.978 605.018 868.082 602.83 890.289C600.569 867.264 598.526 856.229 589.409 850.302C582.333 845.67 570.881 844.171 551.698 842.537C571.684 840.834 583.281 839.267 590.284 834.158C598.672 828.027 600.642 816.991 602.83 794.716C604.872 815.22 606.696 826.188 613.48 832.523C620.263 838.858 632.08 840.629 653.963 842.468Z"
        fill="#031A34"
      />
      <path
        d="M1492.36 370.716C1485.93 381.612 1482.38 387.046 1478.8 387.046C1475.22 387.046 1471.66 381.612 1465.26 370.716C1471.66 381.612 1474.72 387.362 1472.93 390.381C1471.14 393.4 1464.53 393.716 1451.7 393.716C1465 393.716 1471.61 394.032 1473.1 397.367C1474.51 400.472 1471.46 406.193 1465.26 416.716C1471.69 405.82 1475.25 400.386 1478.83 400.386C1482.41 400.386 1485.96 405.82 1492.39 416.716C1485.58 405.13 1482.59 399.38 1485.11 396.505C1487.34 393.975 1493.92 393.716 1505.96 393.716C1492.39 393.716 1485.79 393.371 1484.47 389.835C1483.26 386.672 1486.32 380.98 1492.36 370.716Z"
        fill="#031A34"
      />
      <path
        d="M1449.11 282.966C1434.51 284.865 1426.13 286.612 1420.98 292.386C1414.93 299.146 1413.5 311.528 1411.9 336.292C1410.26 310.617 1408.77 298.311 1402.14 291.702C1396.99 286.536 1388.66 284.865 1374.7 283.042C1389.24 281.143 1397.68 279.396 1402.77 273.699C1408.88 266.862 1410.31 254.556 1411.9 229.716C1413.39 252.581 1414.72 264.811 1419.65 271.876C1424.59 278.94 1433.19 280.915 1449.11 282.966Z"
        fill="#031A34"
      />
      <path
        d="M790.198 334.716L792.532 359.173L811.764 343.503L795.833 362.42L820.698 364.716L795.833 367.012L811.764 385.929L792.532 370.259L790.198 394.716L787.863 370.259L768.631 385.929L784.562 367.012L759.698 364.716L784.562 362.42L768.631 343.503L787.863 359.173L790.198 334.716Z"
        fill="#031A34"
      />
      <path
        d="M1611.75 783.069C1604.84 808.792 1585.51 830.3 1556.36 847.153C1527.21 864.007 1488.28 876.181 1442.28 883.239C1350.28 897.354 1230.1 890.986 1103.55 860.769C976.999 830.552 868.087 782.217 794.302 728.517C757.408 701.666 729.317 673.489 712.188 645.584C695.059 617.682 688.91 590.089 695.819 564.366C702.727 538.643 722.062 517.135 751.211 500.283C780.361 483.429 819.289 471.254 865.289 464.196C957.287 450.081 1077.47 456.449 1204.02 486.666C1330.57 516.884 1439.48 565.219 1513.27 618.919C1550.16 645.77 1578.25 673.947 1595.38 701.851C1612.51 729.754 1618.66 757.347 1611.75 783.069Z"
        stroke="#D1D5E4"
      />
      <path
        d="M1870.81 845.473C1859.98 885.81 1829.66 919.51 1784.02 945.9C1738.38 972.29 1677.44 991.344 1605.46 1002.39C1461.49 1024.48 1273.44 1014.51 1075.44 967.232C877.441 919.954 707.025 844.327 591.561 760.294C533.827 718.276 489.853 674.171 463.031 630.478C436.21 586.787 426.56 543.543 437.393 503.207C448.226 462.87 478.541 429.17 524.183 402.78C569.827 376.39 630.763 357.336 702.747 346.292C846.713 324.204 1034.76 334.17 1232.76 381.448C1430.76 428.726 1601.18 504.353 1716.64 588.387C1774.38 630.404 1818.35 674.509 1845.17 718.202C1871.99 761.893 1881.64 805.137 1870.81 845.473Z"
        stroke="#D1D5E4"
      />
      <g clip-path="url(#clip0_1052_2275)">
        <g filter="url(#filter0_iii_1052_2275)">
          <path
            d="M438.349 647.716C486.398 647.716 525.349 608.765 525.349 560.716C525.349 512.667 486.398 473.716 438.349 473.716C390.3 473.716 351.349 512.667 351.349 560.716C351.349 608.765 390.3 647.716 438.349 647.716Z"
            fill="url(#paint0_linear_1052_2275)"
          />
        </g>
      </g>
      <g clip-path="url(#clip1_1052_2275)">
        <g filter="url(#filter1_iii_1052_2275)">
          <path
            d="M1777.35 791.716C1865.16 791.716 1936.35 720.529 1936.35 632.716C1936.35 544.903 1865.16 473.716 1777.35 473.716C1689.54 473.716 1618.35 544.903 1618.35 632.716C1618.35 720.529 1689.54 791.716 1777.35 791.716Z"
            fill="url(#paint1_linear_1052_2275)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_iii_1052_2275"
          x="316.313"
          y="423.665"
          width="209.036"
          height="244.072"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-35.0358" dy="-50.0511" />
          <feGaussianBlur stdDeviation="40.05" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.676044 0 0 0 0 0.235556 0 0 0 0 0.883333 0 0 0 0.76 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_1052_2275"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="20.0205" />
          <feGaussianBlur stdDeviation="20" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.7625 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_1052_2275"
            result="effect2_innerShadow_1052_2275"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="12" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.26 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_innerShadow_1052_2275"
            result="effect3_innerShadow_1052_2275"
          />
        </filter>
        <filter
          id="filter1_iii_1052_2275"
          x="1583.31"
          y="423.665"
          width="353.036"
          height="388.072"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-35.0358" dy="-50.0511" />
          <feGaussianBlur stdDeviation="40.05" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.676044 0 0 0 0 0.235556 0 0 0 0 0.883333 0 0 0 0.76 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_1052_2275"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="20.0205" />
          <feGaussianBlur stdDeviation="20" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.7625 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_1052_2275"
            result="effect2_innerShadow_1052_2275"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="12" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.26 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_innerShadow_1052_2275"
            result="effect3_innerShadow_1052_2275"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1052_2275"
          x1="357.273"
          y1="527.026"
          x2="459.821"
          y2="569.971"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F4EEFE" />
          <stop offset="1" stop-color="#0066FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1052_2275"
          x1="1629.17"
          y1="571.146"
          x2="1816.59"
          y2="649.631"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F4EEFE" />
          <stop offset="1" stop-color="#0066FF" />
        </linearGradient>
        <clipPath id="clip0_1052_2275">
          <rect
            width="174"
            height="174"
            fill="white"
            transform="translate(351.349 473.716)"
          />
        </clipPath>
        <clipPath id="clip1_1052_2275">
          <rect
            width="318"
            height="318"
            fill="white"
            transform="translate(1618.35 473.716)"
          />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <ContentContainer>
      <div className={styles.planets}>{planets}</div>
      <Circle></Circle>
      <ThemeVariant isInverse>
        <SectionTitle
          isSmall
          align="center"
          title="+36%"
          subtitle="from last year"
        ></SectionTitle>
      </ThemeVariant>
      <div
        className={
          isMobile ? styles.bottomTextMobile : styles.bottomTextDesktop
        }
      >
        <Stack space={16}>
          <Ovni></Ovni>
          <Text size={isMobile ? 18 : 32}>welcome to the team!</Text>
        </Stack>
      </div>
    </ContentContainer>
  );
};

export default Members;
