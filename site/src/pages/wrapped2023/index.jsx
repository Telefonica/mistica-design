import { useScreenSize } from "@telefonica/mistica";
import { Section, Wrapper } from "./components/components";
import Intro from "./pages/intro";
import Teams from "./pages/teams";
import Cover from "./pages/cover";
import Members from "./pages/members";
import MembersCount from "./pages/members-count";
import NewComponents from "./pages/new-components";
import MostUsedComponent from "./pages/most-used-component";
import OtherUsedComponents from "./pages/other-used-components";
import IconsPage from "./pages/icons";
import BrandFactory from "./pages/brand-factory";
import GitHub from "./pages/github";
import NewComponentsTitle from "./pages/new-components-title";
import GitHubContributors from "./pages/github-contributors";
import MostUsedComponentStats from "./pages/most-used-component-stats";
import Outro from "./pages/outro";
import IconsStats from "./pages/icons-stats";

const Wrapped2023 = () => {
  const { isMobile } = useScreenSize();

  return (
    <Wrapper>
      <Section color="#031A34">
        <Cover />
      </Section>
      <Section>
        <Intro />
      </Section>
      <Section>
        <Teams />
      </Section>
      <Section>
        <Members />
      </Section>
      <Section>
        <MembersCount />
      </Section>
      <Section>
        <NewComponentsTitle />
      </Section>
      <Section>
        <NewComponents />
      </Section>
      <Section>
        <MostUsedComponent />
      </Section>
      <Section>
        <MostUsedComponentStats />
      </Section>
      <Section>
        <OtherUsedComponents />
      </Section>
      <Section>
        <IconsPage />
      </Section>
      <Section>
        <IconsStats />
      </Section>
      <Section>
        <BrandFactory />
      </Section>
      <Section sticky>
        <GitHub />
      </Section>
      <Section isVisible={isMobile ? true : false}>
        {isMobile && <GitHubContributors />}
      </Section>
      <Section>
        <Outro />
      </Section>
    </Wrapper>
  );
};

export default Wrapped2023;
