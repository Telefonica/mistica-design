import { Text, useScreenSize, Stack } from "@telefonica/mistica";

const SectionTitle = ({ title, title2, svg, pretitle, subtitle }) => {
  const { isMobile } = useScreenSize();

  return (
    <Stack space={0}>
      <Text size={isMobile ? 24 : 48}>{pretitle}</Text>
      <Text size={isMobile ? 48 : 140} weight="bold">
        {title}
      </Text>
      {svg}
      <Text size={isMobile ? 48 : 140} weight="bold">
        {title2}
      </Text>
      <Text size={isMobile ? 24 : 48}>{subtitle}</Text>
    </Stack>
  );
};

export default SectionTitle;
