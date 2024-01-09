import SectionTitle from "../components/section-title";
import { useScreenSize, Stack, Text, Text5 } from "@telefonica/mistica";
import { Components } from "../data/figmaData";
import styles from "./most-used-component-stats.module.css";
import { formatCount } from "../utils";
import {
  mostUsedComponentTitle,
  mostUsedComponentSubtitle,
  mostUsedComponentPretitle,
} from "../data/texts";
import ContentContainer from "../components/content-container";

const MostUsedComponentStats = () => {
  const { isMobile } = useScreenSize();
  const { componentWithHighestCount } = Components();

  const flag = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={isMobile ? "64" : "150"}
      height="auto"
      viewBox="0 0 64 49"
      fill="none"
    >
      <path
        d="M14.7524 10.5371L15.251 48.2983"
        stroke="#E3B315"
        stroke-width="2"
      />
      <path
        d="M64 26.049L15.0434 11.6028L15.0434 35.5489L64 26.049Z"
        fill="#E3B315"
      />
      <mask
        id="mask0_878_4563"
        maskUnits="userSpaceOnUse"
        x="16"
        y="15"
        width="29"
        height="17"
      >
        <path
          d="M44.1358 22.2219L16.6362 15.4038L17.7726 31.704L44.1358 27.4491V22.2219Z"
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#mask0_878_4563)">
        <path
          d="M42.2893 27.9129H41.6571C41.6425 27.9129 41.6353 28.2288 41.6353 27.873V21.6965C41.6353 21.6752 41.6425 21.6646 41.6571 21.6646L42.7852 21.88C42.9869 21.88 42.5624 21.8121 43.1352 21.959C43.7081 22.106 43.7499 22.4719 43.7444 22.4587C43.8462 22.7007 43.897 22.9748 43.897 23.2807C43.897 23.4802 43.8762 23.6611 43.8344 23.8234C43.7926 23.9857 43.7435 24.1227 43.6872 24.2344C43.6327 24.3462 43.5828 24.4286 43.5373 24.4818C43.739 24.8091 43.8398 25.1935 43.8398 25.6351L43.8562 27.873C43.8562 27.8996 43.8453 28.2288 43.8289 27.9129H43.1967C43.1822 27.9129 43.1749 27.905 43.1749 27.889L43.164 25.6351C43.164 25.4382 43.1168 25.268 43.0223 25.1243C42.9278 24.9807 42.8116 24.9088 42.6735 24.9088H42.3056L42.3111 27.873C42.3111 27.8996 42.3038 27.9129 42.2893 27.9129ZM42.7852 22.6422H42.3056V23.9272H42.7852C42.8997 23.9272 43.0014 23.8646 43.0904 23.7396C43.1813 23.6146 43.2267 23.4616 43.2267 23.2807C43.2267 23.1078 43.1831 22.9588 43.0959 22.8338C43.0087 22.7061 42.9051 22.6422 42.7852 22.6422Z"
          fill="white"
        />
        <path
          d="M40.6663 28.2679L38.4604 28.5448C38.4425 28.5448 38.4671 29.1376 38.4336 28.4961L38.4606 21.0019C38.4606 20.647 38.4202 20.331 38.4538 20.647L40.693 20.9629C40.7109 20.9629 40.7198 20.9791 40.7198 21.0117L40.6864 22.5034C40.6864 22.5294 40.6775 22.5424 40.6596 22.5424H39.2517V24.0169H40.6596C40.6775 24.0169 40.6864 24.0299 40.6864 24.0559L40.6931 25.1874C40.6931 25.2134 40.6842 25.2264 40.6663 25.2264H39.2517L39.2517 27.0389H40.6663C40.6842 27.0389 40.6931 27.0551 40.6931 27.0876L40.7198 28.5448C40.7198 28.5708 40.6842 28.2679 40.6663 28.2679Z"
          fill="white"
        />
        <path
          d="M35.542 29.1767H34.8178C34.7801 29.1767 34.7612 29.1498 34.7612 29.0961L34.8178 19.9492C34.8178 19.8877 34.8366 19.8569 34.8743 19.8569H35.5278L36.7502 24.9827L36.7148 20.4234C36.7148 20.3619 36.736 20.3311 36.7784 20.3311H37.4956C37.5239 20.3311 37.538 20.3619 37.538 20.4234L37.4956 28.8126C37.4956 28.8588 37.4838 28.8818 37.4603 28.8818H36.8244L35.6197 24.1988L35.6091 29.0845C35.6091 29.146 35.5867 29.1767 35.542 29.1767Z"
          fill="white"
        />
        <path
          d="M31.3132 29.9016H30.3476C30.2974 29.9016 30.2723 29.8705 30.2723 29.8085L30.1969 18.6919C30.1969 18.6209 30.222 18.5854 30.2722 18.5854H31.1436L32.8488 25.0664L32.7546 19.2673C32.7546 19.1963 32.7828 19.1608 32.8393 19.1608H33.7955C33.8332 19.1608 33.8521 19.1963 33.8521 19.2673L33.8992 29.4925C33.8992 29.5457 33.8835 29.5723 33.8521 29.5723H33.0042L31.3415 24.1619L31.4027 29.7952C31.4027 29.8661 31.3729 29.9016 31.3132 29.9016Z"
          fill="white"
        />
        <path
          d="M28.8237 30.1985H27.5879C27.5524 30.1985 27.5347 30.1738 27.5347 30.1244L27.588 17.6764C27.5347 17.321 27.5988 17.679 27.588 17.6764L28.8665 17.9923C28.8949 17.9923 28.9091 18.0121 28.9091 18.0516L28.8663 30.1244C28.8663 30.1738 28.8521 30.1985 28.8237 30.1985Z"
          fill="white"
        />
        <path
          d="M21.1531 31.7041H19.1397C19.091 31.7041 19.064 31.6672 19.0586 31.5933L17.0614 15.1766C17.0505 15.1174 17.0668 15.0879 17.1101 15.0879H18.9773C19.0206 15.0879 19.0477 15.1174 19.0585 15.1766L20.1546 26.2504L21.1531 17.6765C21.164 17.6174 21.1964 17.5879 21.2506 17.5879L23.0687 17.9038C23.112 17.9038 23.1391 17.9333 23.1499 17.9924L24.0108 26.2504L24.8177 17.2719C24.8285 17.2128 24.8555 17.1832 24.8988 17.1832L26.5709 17.4992C26.625 17.4992 26.6466 17.5287 26.6358 17.5878L25.1068 31.5933C25.1014 31.6228 25.0852 31.6487 25.0581 31.6709L25.0257 31.7041H23.0123C22.9798 31.7041 22.9527 31.6672 22.9311 31.5933L22.0786 23.446L21.2343 31.5933C21.2289 31.6672 21.2018 31.7041 21.1531 31.7041Z"
          fill="white"
        />
      </g>
      <path
        d="M25.7109 5.47944C25.7109 5.01437 25.8755 4.61706 26.2047 4.28752C26.5337 3.95814 26.9306 3.79346 27.3955 3.79346C27.8603 3.79346 28.2578 3.95814 28.5878 4.28752C28.9179 4.61689 29.0829 5.0142 29.0829 5.47944C29.0829 5.94468 28.9179 6.34199 28.5878 6.67136C28.2578 7.00074 27.8603 7.16542 27.3955 7.16542C26.9308 7.16542 26.5339 7.00074 26.2047 6.67136C25.8756 6.34182 25.7109 5.94451 25.7109 5.47944Z"
        fill="#E3B315"
      />
      <path
        d="M36.2485 39.6018L38.3198 36.6699L40.391 39.6018L38.3198 42.5338L36.2485 39.6018Z"
        fill="#E3B315"
      />
      <path
        d="M2.0733 21.4619L6.21967 21.4619L6.2146 25.6032L2.0733 25.6082L2.0733 21.4619Z"
        fill="#E3B315"
      />
      <path
        d="M0.843262 3.79346L3.68843 2.84517L4.63672 0L5.58501 2.84517L8.43019 3.79346L5.58501 4.74175L4.63672 7.58692L3.68843 4.74175L0.843262 3.79346Z"
        fill="#E3B315"
      />
    </svg>
  );

  const family = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={isMobile ? "32" : "64"}
      height="auto"
      viewBox="0 0 32 25"
      fill="none"
    >
      <circle cx="5.33366" cy="4.66667" r="4.66667" fill="#E3B315" />
      <circle cx="26.6667" cy="4.66667" r="4.66667" fill="#E3B315" />
      <ellipse
        cx="15.9997"
        cy="11.3337"
        rx="2.66667"
        ry="2.66667"
        fill="#E3B315"
      />
      <path
        d="M12.6665 18.6663C12.6665 16.8254 14.1589 15.333 15.9998 15.333C17.8408 15.333 19.3332 16.8254 19.3332 18.6663V24.6663H12.6665V18.6663Z"
        fill="#E3B315"
      />
      <path
        d="M0 17.3333C0 14.3878 2.38781 12 5.33333 12C8.27885 12 10.6667 14.3878 10.6667 17.3333V24.6667H0V17.3333Z"
        fill="#E3B315"
      />
      <path
        d="M21.333 17.3333C21.333 14.3878 23.7208 12 26.6663 12C29.6119 12 31.9997 14.3878 31.9997 17.3333V24.6667H21.333V17.3333Z"
        fill="#E3B315"
      />
    </svg>
  );

  const podium = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={isMobile ? "48" : "88"}
      height="auto"
      viewBox="0 0 48 39"
      fill="none"
    >
      <rect y="26.1816" width="14.7273" height="12.5455" fill="#E3B315" />
      <rect
        x="33.2729"
        y="29.4546"
        width="14.7273"
        height="9.27273"
        fill="#E3B315"
      />
      <rect
        x="16.9092"
        y="15.2729"
        width="14.7273"
        height="23.4545"
        fill="#E3B315"
      />
      <path
        d="M23.7118 20.1816H26.1336V27.7482C26.4216 29.4238 27.9532 29.2013 28.4769 29.2275V29.3453H21.3947V29.2275C21.9183 29.2013 23.4238 29.4238 23.7118 27.7482V20.1816ZM20.7271 25.2478V22.2107H22.298C23.1881 22.2107 23.5547 20.9671 23.5547 20.1816H23.7118C23.7118 21.386 23.4238 23.5198 22.6514 24.3838C22.0885 25.0122 21.5649 25.2216 20.7271 25.2478Z"
        fill="white"
      />
      <path
        d="M3.27295 16.885L5.95331 13.0908L8.63368 16.885L5.95331 20.6792L3.27295 16.885Z"
        fill="#E3B315"
      />
      <path
        d="M38.1374 19.0467H43.5032L43.4966 24.4059L38.1374 24.4124V19.0467Z"
        fill="#E3B315"
      />
      <path
        d="M19.6362 4.90908L23.3181 3.68192L24.5453 0L25.7725 3.68192L29.4544 4.90908L25.7725 6.13626L24.5453 9.81818L23.3181 6.13626L19.6362 4.90908Z"
        fill="#E3B315"
      />
    </svg>
  );

  const ListItem = ({ children, leadingIcon, trailingIcon }) => (
    <li
      style={{ borderBottom: isMobile ? "4px solid black" : "8px solid black" }}
    >
      {leadingIcon}
      <div
        className={styles.listContent}
        style={{
          gap: isMobile ? 8 : 16,
        }}
      >
        {children}
      </div>
      {trailingIcon}
    </li>
  );

  const dataSize = isMobile ? 56 : 140;
  const descriptionSize = isMobile ? 18 : 32;

  return (
    <ContentContainer justify="center">
      <ul className={styles.list} style={{ width: isMobile ? "100%" : "50%" }}>
        <ListItem trailingIcon={flag}>
          <Text size={dataSize} weight="bold">
            {formatCount(componentWithHighestCount.count)}
          </Text>
          <Text size={descriptionSize}>instances in Figma</Text>
        </ListItem>
        <ListItem leadingIcon={family}>
          <Text size={descriptionSize}>Used by</Text>
          <Text size={dataSize} weight="bold">
            {componentWithHighestCount.usedBy}
          </Text>{" "}
          <Text size={descriptionSize}>teams</Text>{" "}
        </ListItem>
        <ListItem trailingIcon={podium}>
          <Text size={dataSize} weight="bold">
            {componentWithHighestCount.percentageChange}
          </Text>
          <Text size={descriptionSize}>from last year</Text>
        </ListItem>
      </ul>
    </ContentContainer>
  );
};

export default MostUsedComponentStats;
