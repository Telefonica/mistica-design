import { useEffect, useState } from "react";
import { Components, newComponents, topTeams, teams } from "./data/figmaData";
import { teamsMembers } from "./data/teamsData";
import { medianBFSessions } from "./data/brandFactoryData";
import { releases, mergedPRs } from "./data/devData";
import { formatCount } from "./utils";

import { Title2, Title1, Title3, useScreenSize } from "@telefonica/mistica";

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

  {
    /*  async function getPRs() {
    try {
      const response = await fetch("/api/fetchPRs");
      const PRs = await response.json();
      return PRs; // Return the PRs data
    } catch (error) {
      console.error("Error fetching PRs:", error);
      throw error; // Rethrow the error for handling in the calling code
    }
  } */
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
        <OtherUsedComponents></OtherUsedComponents>
      </Section>
      <Section>
        <Icons></Icons>
      </Section>
      <Section>
        <BrandFactory></BrandFactory>
      </Section>
      <Section sticky>
        <GitHub />
      </Section>
      <Section>
        <Title2>Github</Title2>

        <Title1>Releases</Title1>
        <ul>
          {Object.keys(releases).map((release) => (
            <li key={release}>
              {releases[release].name} {releases[release].count} releases
            </li>
          ))}
        </ul>

        <Title1>Merged PRs</Title1>

        <ul>
          {Object.keys(mergedPRs).map((pr) => (
            <li key={pr}>
              {mergedPRs[pr].name}: {mergedPRs[pr].count}
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <Title1>Issues</Title1>

        <p>Created issues: {createdIssuesCount}</p>
        <p>Closed issues: {closedIssuesCount}</p>
        <p>Remaining open issues:{openedIssuesCount}</p>

        <Title1>Discussions</Title1>

        <Title1>Closed discusssions last year</Title1>
        <p>{closedDiscussions.length}</p>

        <Title1>Most active users</Title1>
        <ul>
          {mostActiveAuthors.map((author) => (
            <li key={author.authorLogin}>
              {author.authorLogin} {author.discussionsCount}{" "}
              {author.discussionsCount > 1 ? "discussions" : "discussion"}
            </li>
          ))}
        </ul>
      </Section>
    </Wrapper>
  );
};

export default Wrapped2023;
