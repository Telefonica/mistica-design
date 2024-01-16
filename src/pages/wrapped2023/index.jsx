import { useEffect, useState } from "react";
import { Components, newComponents, topTeams, teams } from "./data/figmaData";
import { teamsMembers } from "./data/teamsData";
import { medianBFSessions } from "./data/brandFactoryData";
import { releases, mergedPRs } from "./data/devData";
import { formatCount } from "./utils";
import { Helmet } from "react-helmet";
import thumbnail from "./assets/thumbnail.png";

import {
  Title2,
  Title1,
  Title3,
  useScreenSize,
  ThemeContext,
} from "@telefonica/mistica";

import { Section, Wrapper } from "./components/components";
import Intro from "./pages/intro";
import Teams from "./pages/teams";
import Cover from "./pages/cover";
import Members from "./pages/members";
import MembersCount from "./pages/members-count";
import NewComponents from "./pages/new-components";
import MostUsedComponent from "./pages/most-used-component";
import OtherUsedComponents from "./pages/other-used-components";
import Icons from "./pages/icons";
import BrandFactory from "./pages/brand-factory";
import GitHub from "./pages/github";
import NewComponentsTitle from "./pages/new-components-title";
import GitHubContributors from "./pages/github-contributors";
import MostUsedComponentStats from "./pages/most-used-component-stats";
import Outro from "./pages/outro";
import IconsStats from "./pages/icons-stats";

const Wrapped2023 = () => {
  const [mostActiveAuthors, setMostActiveAuthors] = useState([]);
  const [closedDiscussions, setClosedDiscussions] = useState([]);
  const [closedIssuesCount, setClosedIssuesCount] = useState(0);
  const [openedIssuesCount, setOpenedIssuesCount] = useState(0);
  const [createdIssuesCount, setCreatedIssuesCount] = useState(0);

  const { isMobile } = useScreenSize();

  async function getDiscussions() {
    try {
      const response = await fetch("/api/fetchDiscussions");
      const discussions = await response.json();
      return discussions; // Return the discussions data
    } catch (error) {
      console.error("Error fetching discussions:", error);
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  async function getIssues() {
    try {
      const response = await fetch("/api/fetchIssues");
      const issues = await response.json();
      return issues; // Return the issues data
    } catch (error) {
      console.error("Error fetching issues:", error);
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  async function fetchData() {
    try {
      const discussionsData = await getDiscussions();
      const { mostActiveAuthors, closedDiscussions } = discussionsData;
      setMostActiveAuthors(mostActiveAuthors);
      setClosedDiscussions(closedDiscussions);

      const issuesData = await getIssues();
      const { createdIssueCount, closedIssueCount, openIssueCount } =
        issuesData;
      setCreatedIssuesCount(createdIssueCount);
      setClosedIssuesCount(closedIssueCount);
      setOpenedIssuesCount(openIssueCount);
      {
        /*
      const PRsData = await getPRs();
      const { mergedPRs } = PRsData;
      setMergedPRs(mergedPRs);

      console.log(mergedPRs);
        */
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error
    }
  }

  // Call fetchData to initiate the data fetching process
  useEffect(() => {
    fetchData();
  }, []);

  const { componentWithHighestCount, restOfMostUsedComponents } = Components();
  const { iconWithHighestCount, restOfMostUsedIcons } = Icons();

  return (
    <>
      <Helmet>
        <title>Wrapped 2023</title>
        <meta
          name="description"
          content="Wrapped 2023 is a celebration of the work of the Telefonica Design System team in 2023"
        />
        <meta property="og:title" content="Wrapped 2023" />
        <meta
          property="og:description"
          content="Wrapped 2023 is a celebration of the work of the Telefonica Design System team in 2023"
        />
        <meta
          property="og:image"
          content="https://mistica-design-dg8f5xdzr-aweell.vercel.app/static/media/thumbnail.bd98c1039c876d408948.png"
        />
        <meta property="twitter:title" content="Wrapped 2023" />
        <meta
          property="twitter:description"
          content="Wrapped 2023 is a celebration of the work of the Telefonica Design System team in 2023"
        />
        <meta property="twitter:card" content="summary_large_image" />
      </Helmet>
      <Wrapper>
        <Section color="#031A34">
          <Cover></Cover>
        </Section>
        <Section>
          <Intro></Intro>
        </Section>
        <Section>
          <Teams></Teams>
        </Section>
        <Section>
          <Members></Members>
        </Section>
        <Section>
          <MembersCount></MembersCount>
        </Section>

        <Section>
          <NewComponentsTitle></NewComponentsTitle>
        </Section>
        <Section>
          <NewComponents></NewComponents>
        </Section>

        <Section>
          <MostUsedComponent></MostUsedComponent>
        </Section>
        <Section>
          <MostUsedComponentStats />
        </Section>
        <Section>
          <OtherUsedComponents></OtherUsedComponents>
        </Section>
        <Section>
          <Icons></Icons>
        </Section>
        <Section>
          <IconsStats />
        </Section>
        <Section>
          <BrandFactory></BrandFactory>
        </Section>
        <Section sticky>
          <GitHub />
        </Section>
        <Section isVisible={isMobile ? true : false}>
          {isMobile && <GitHubContributors></GitHubContributors>}
        </Section>
        <Section>
          <Outro></Outro>
        </Section>
      </Wrapper>
    </>
  );
};

export default Wrapped2023;
