import { Icons as IconData } from "../data/figmaData";
import styles from "./icons.module.css";
import {
  Grid,
  GridItem,
  IconAcademicRegular,
  IconAntennaRegular,
  IconBandAidRegular,
  IconBeachUmbrellaRegular,
  IconBoatRegular,
  IconBriefcaseBusinessRegular,
  IconBugRegular,
  IconBusRegular,
  IconCarRegular,
  IconChemistryRegular,
  IconChildRegular,
  IconConferenceRegular,
  IconConnectionsRegular,
  IconCreditCardRegular,
  IconDiamondRegular,
  IconDrinkRegular,
  IconEcoRegular,
  IconFileErrorRegular,
  IconFireRegular,
  IconFlowerRegular,
  IconFragranceRegular,
  IconGiftRegular,
  Inline,
  Stack,
  useScreenSize,
} from "@telefonica/mistica";
import { formatCount } from "../utils";
import SectionTitle from "../components/section-title";
import ContentContainer from "../components/content-container";

const Icons = () => {
  const { isMobile } = useScreenSize();

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      maxWidth={445}
      height="122"
      viewBox="0 0 445 122"
      fill="none"
      style={{ mixBlendMode: "multiply" }}
    >
      <g>
        <path
          d="M18.8723 107.862H0.112305V9.86207H18.8723V107.862Z"
          fill="#0066FF"
        />
        <path
          d="M78.4106 109.262C51.9506 109.262 30.9506 88.5421 30.9506 58.8621C30.9506 29.1821 51.9506 8.46207 78.4106 8.46207C103.751 8.46207 118.871 27.0821 122.651 44.5821H103.751C100.951 35.3421 92.1306 26.3821 78.4106 26.3821C62.4506 26.3821 49.7106 39.2621 49.7106 58.8621C49.7106 78.4621 62.4506 91.3421 78.4106 91.3421C92.5506 91.3421 101.091 82.1021 103.751 72.4421H122.651C119.011 90.3621 104.171 109.262 78.4106 109.262Z"
          fill="#0066FF"
        />
        <path
          d="M176.476 109.262C150.016 109.262 129.016 88.5421 129.016 58.8621C129.016 29.1821 150.016 8.46207 176.476 8.46207C202.796 8.46207 223.796 29.1821 223.796 58.8621C223.796 88.5421 202.796 109.262 176.476 109.262ZM176.476 91.3421C192.296 91.3421 205.176 78.4621 205.176 58.8621C205.176 39.2621 192.296 26.3821 176.476 26.3821C160.516 26.3821 147.776 39.2621 147.776 58.8621C147.776 78.4621 160.516 91.3421 176.476 91.3421Z"
          fill="#0066FF"
        />
        <path
          d="M242.234 3.84207L243.074 4.12207C241.114 11.2621 245.314 21.0621 252.034 21.0621C266.314 21.0621 275.974 2.58207 298.234 2.72207C314.334 2.86207 328.754 17.0021 317.694 38.8421C309.574 54.8021 282.974 84.7621 282.974 101.282C282.974 106.882 286.054 113.462 292.914 113.462C319.934 113.462 316.434 57.1821 330.434 22.0421C336.174 7.62207 356.894 3.98207 368.934 3.98207H389.514L389.234 5.24207C381.394 5.24207 375.514 4.82207 368.094 8.74207C347.514 19.8021 336.174 78.7421 323.154 96.3821C318.394 102.962 307.894 115.142 292.774 115.142C283.534 115.142 264.354 107.582 264.354 89.8021C264.354 63.3421 307.054 54.6621 316.994 35.6221C319.094 31.5621 319.654 27.0821 319.094 23.7221C317.834 16.4421 300.194 13.2221 290.254 12.1021C267.294 57.7421 251.334 113.602 225.854 113.602L231.174 78.1821C252.594 79.1621 276.114 36.1821 287.734 11.9621C285.914 11.8221 284.514 11.6821 283.814 11.6821C262.534 11.6821 255.814 41.6421 245.034 41.6421C238.734 41.6421 237.194 33.1021 237.194 26.6621C237.194 16.8621 239.714 7.76207 242.234 3.84207Z"
          fill="#0066FF"
        />
        <path
          d="M394.571 30.7221C389.951 23.8621 387.571 12.1021 392.191 1.88207L380.711 9.58207C375.951 13.5021 375.811 17.9821 375.811 21.2021C375.811 49.9021 444.411 59.0021 444.411 87.9821C444.411 109.542 405.771 122.002 388.411 122.002C367.131 122.002 346.131 101.002 362.091 81.5421L391.771 65.8621L392.751 66.9821C381.551 72.3021 376.651 79.4421 376.651 89.1021C376.651 115.702 429.571 125.222 429.571 99.0421C429.571 63.0621 362.091 69.2221 362.091 30.5821C362.091 17.9821 383.651 6.64207 392.751 0.62207C405.771 29.4621 426.211 31.2821 430.131 5.94207H431.111L425.651 42.3421C414.171 42.3421 401.291 40.5221 394.571 30.7221Z"
          fill="#0066FF"
        />
      </g>
    </svg>
  );

  const iconColors = ["#0066FF", "#FF0000"];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * iconColors.length);
    return iconColors[randomIndex];
  };

  const iconsData = [
    { IconComponent: IconBriefcaseBusinessRegular, name: "BriefcaseBusiness" },
    { IconComponent: IconBugRegular, name: "Bug" },
    { IconComponent: IconBusRegular, name: "Bus" },
    { IconComponent: IconChemistryRegular, name: "Chemistry" },
    { IconComponent: IconCarRegular, name: "Car" },
    { IconComponent: IconChildRegular, name: "Child" },
    { IconComponent: IconAcademicRegular, name: "Academic" },
    { IconComponent: IconAntennaRegular, name: "Antenna" },
    { IconComponent: IconBandAidRegular, name: "BandAid" },
    { IconComponent: IconBeachUmbrellaRegular, name: "BeachUmbrella" },
    { IconComponent: IconBoatRegular, name: "Boat" },
    { IconComponent: IconFileErrorRegular, name: "FileError" },
    { IconComponent: IconFireRegular, name: "Fire" },
    { IconComponent: IconFlowerRegular, name: "Flower" },
    { IconComponent: IconFragranceRegular, name: "Fragance" },
    { IconComponent: IconGiftRegular, name: "Gift" },
    { IconComponent: IconConferenceRegular, name: "Conference" },
    { IconComponent: IconCreditCardRegular, name: "CreditCard" },
    { IconComponent: IconConnectionsRegular, name: "Connections" },
    { IconComponent: IconDiamondRegular, name: "Diamond" },
    { IconComponent: IconDrinkRegular, name: "Drink" },
    { IconComponent: IconEcoRegular, name: "Eco" },
  ];

  const backgroundIcons = (size = 100) => {
    return iconsData.map(({ IconComponent, name }, index) => (
      <IconComponent
        key={index}
        size={size}
        color={index % 2 === 1 ? "#0066FF" : "#FF0000"}
      />
    ));
  };

  return (
    <ContentContainer overflowY="visible" margin="12.5vw 0">
      <div className={styles.gridBackground}>
        <Grid columns={isMobile ? 3 : 6} gap={164}>
          {backgroundIcons().map((key, index) => (
            <GridItem key={index}>{key}</GridItem>
          ))}
        </Grid>
      </div>
      <Stack space={64}>
        <SectionTitle align="center" svg={svg} />
        {/*
        <ul>
          <Grid columns={3} gap={24}>
            {Object.keys(IconData).map((key, index) => {
              const icon = IconData[key];
              return (
                <GridItem key={key}>
                  <li>
                    <Stack space={16}>
                      <span>#{index + 1}</span>
                      {icon.icon}
                      {icon.name}
                      {formatCount(icon.count)}
                    </Stack>
                  </li> 
                </GridItem>
              );
            })}
          </Grid>
        </ul>*/}
      </Stack>
    </ContentContainer>
  );
};

export default Icons;
