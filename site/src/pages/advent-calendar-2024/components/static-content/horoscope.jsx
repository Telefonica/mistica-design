import {
  DisplayDataCard,
  Grid,
  GridItem,
  Text6,
  ButtonLink,
  useScreenSize,
} from "@telefonica/mistica";

const Horoscope = () => {
  const { isMobile } = useScreenSize();
  const zodiacComponents = [
    {
      sign: "Aries",
      icon: "♈︎",
      component: "Badge",
      explanation:
        "Aries is competitive and direct, always seeking to stand out. Badges highlight important elements, mirroring Aries' desire to draw attention.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/badge",
    },
    {
      sign: "Taurus",
      icon: "♉︎",
      component: "Chip",
      explanation:
        "Taurus is practical and reliable, appreciating simplicity and order. Chips are compact and functional, aligning with Taurus' grounded nature.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/chips",
    },
    {
      sign: "Gemini",
      icon: "♊︎",
      component: "Button",
      explanation:
        "Gemini is dynamic and communicative, always on the move. Buttons activate actions, reflecting Gemini's active and versatile traits.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/buttons",
    },
    {
      sign: "Cancer",
      icon: "♋︎",
      component: "Dialog",
      explanation:
        "Cancer is emotional and introspective, creating spaces for meaningful conversations. Dialogs support deep and important interactions.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/modals/dialog",
    },
    {
      sign: "Leo",
      icon: "♌︎",
      component: "Avatar",
      explanation:
        "Leo is charismatic and loves to be the center of attention. Avatars represent individuals, highlighting their leadership and presence.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/avatar",
    },
    {
      sign: "Virgo",
      icon: "♍︎",
      component: "Input",
      explanation:
        "Virgo is detail-oriented and analytical, always seeking perfection. Inputs allow for gathering and refining information, matching Virgo's focus.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/input-fields",
    },
    {
      sign: "Libra",
      icon: "♎︎",
      component: "Card",
      explanation:
        "Libra is balanced and aesthetic, seeking harmony. Cards combine clean design and structure, reflecting Libra’s need for balance.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/cards",
    },
    {
      sign: "Scorpio",
      icon: "♏︎",
      component: "Link",
      explanation:
        "Scorpio is mysterious and transformative, deeply exploring connections. Links join elements together, aligning with Scorpio's nature.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/textlink",
    },
    {
      sign: "Sagittarius",
      icon: "♐︎",
      component: "Spinner",
      explanation:
        "Sagittarius is adventurous and energetic, always in motion. Spinners represent ongoing action, resonating with Sagittarius' restless spirit.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/spinner",
    },
    {
      sign: "Capricorn",
      icon: "♑︎",
      component: "Snackbar",
      explanation:
        "Capricorn is pragmatic and efficient, focusing on essentials. Snackbars provide quick, useful updates without distractions, like Capricorn.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/snackbar",
    },
    {
      sign: "Aquarius",
      icon: "♒︎",
      component: "Checkbox",
      explanation:
        "Aquarius is innovative and values choice. Checkboxes offer control and personalized decisions, aligning with Aquarius’ forward-thinking nature.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/checkbox",
    },
    {
      sign: "Pisces",
      icon: "♓︎",
      component: "Radio",
      explanation:
        "Pisces is intuitive and sensitive, focusing on one direction. Radios reflect this focus by allowing a single, deliberate choice.",
      link: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/radio-button",
    },
  ];

  return (
    <Grid columns={isMobile ? 1 : 3} gap={24}>
      {zodiacComponents.map(({ icon, sign, component, explanation, link }) => (
        <GridItem key={sign}>
          <DisplayDataCard
            buttonLink={
              <ButtonLink href={link}>Go to {component} doc</ButtonLink>
            }
            asset={<Text6>{icon}</Text6>}
            pretitle={sign}
            description={explanation}
            title={component}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default Horoscope;
