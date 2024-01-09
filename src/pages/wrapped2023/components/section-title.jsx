import { Text, useScreenSize, Stack } from "@telefonica/mistica";
import styles from "./section-title.module.css";

const SectionTitle = ({
  title,
  title2,
  svg,
  pretitle,
  subtitle,
  align,
  isSmall,
}) => {
  const { isMobile } = useScreenSize();

  return (
    <Stack
      space={0}
      className={`${styles.container} ${
        align === "center" ? styles.alignCenter : styles.alignLeft
      }`}
    >
      <Text size={isMobile ? 18 : isSmall ? 24 : 32}>{pretitle}</Text>
      <Text
        size={isMobile ? (isSmall ? 56 : 64) : isSmall ? 80 : 120}
        weight="bold"
      >
        {title}
      </Text>
      {svg}
      <Text size={isMobile ? 56 : isSmall ? 80 : 120} weight="bold">
        {title2}
      </Text>
      <Text size={isMobile ? 18 : isSmall ? 24 : 32}>{subtitle}</Text>
    </Stack>
  );
};

export default SectionTitle;
