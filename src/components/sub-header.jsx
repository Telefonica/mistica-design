import {
  Inline,
  ButtonLink,
  IconChevronLeftRegular,
} from "@telefonica/mistica";

const SubHeader = ({ to }) => {
  return (
    <Inline space="between" alignItems="center">
      <ButtonLink
        to={to}
        StartIcon={IconChevronLeftRegular}
        withChevron={false}
        bleedLeft
      >
        Go back
      </ButtonLink>
    </Inline>
  );
};

export default SubHeader;
