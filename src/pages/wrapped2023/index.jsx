import { useEffect, useState } from "react";
import { Components, Icons, newComponents, topTeams, teams } from "./figmaData";

import { medianBFSessions } from "./brandFactoryData";
import { formatCount } from "./utils";

import {
  Title2,
  Title1,
  Title3,
  Stack,
  ResponsiveLayout,
} from "@telefonica/mistica";

const Wrapped2023 = () => {
  const [mostActiveAuthors, setMostActiveAuthors] = useState([]);
  const [closedDiscussions, setClosedDiscussions] = useState([]);
  const [closedIssuesCount, setClosedIssuesCount] = useState(0);
  const [openedIssuesCount, setOpenedIssuesCount] = useState(0);
  const [createdIssuesCount, setCreatedIssuesCount] = useState(0);

  // Function to fetch discussions
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

  // Function to fetch issues
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

  // Example usage:
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
    <ResponsiveLayout>
      <Stack space={24}>
        <Title3>Wrapped2023</Title3>
        <Title2>Figma</Title2>
        <Title1>Most used Figma component</Title1>
        <p>
          {componentWithHighestCount.name},{" "}
          {formatCount(componentWithHighestCount.count)} instances, Used by{" "}
          {componentWithHighestCount.usedBy} teams
        </p>

        <Title1>Other highly used Figma components</Title1>
        <ul>
          {restOfMostUsedComponents
            .sort((a, b) => b.count - a.count)
            .map((component) => (
              <li key={component.name}>
                {component.name} {formatCount(component.count)} instances
              </li>
            ))}
        </ul>

        <Title1>Most used Figma icon</Title1>
        <p>
          {iconWithHighestCount.icon}
          {iconWithHighestCount.name} {formatCount(iconWithHighestCount.count)}{" "}
          instances
        </p>
        <Title1>Other highly used Figma icons</Title1>
        <ul>
          {restOfMostUsedIcons
            .sort((a, b) => b.count - a.count)
            .map((icon) => (
              <li key={icon.name}>
                {icon.icon}
                {icon.name} {formatCount(icon.count)} instances
              </li>
            ))}
        </ul>

        <Title1>New components</Title1>

        <ul>
          {newComponents.map((component) => (
            <li key={component.name}>
              {component.name} (from release {component.release})
            </li>
          ))}
        </ul>

        <Title1>Top teams by insertions</Title1>
        <Title1>Mobile</Title1>
        <ul>
          {topTeams.mobile.map((team) => (
            <li key={team.name}>
              {team.name} {formatCount(team.count)}% insertions
            </li>
          ))}
        </ul>
        <Title1>Desktop</Title1>
        <ul>
          {topTeams.desktop.map((team) => (
            <li key={team.name}>
              {team.name} {formatCount(team.count)}% insertions
            </li>
          ))}
        </ul>

        <Title1>All teams using Mística Figma libraries</Title1>
        <p>Number of teams: {teams.length}</p>
        <ul>
          {teams.map((team) => (
            <li key={team}>{team}</li>
          ))}
        </ul>

        <Title2>Brand factory</Title2>
        <Title1>Median BF sessions (from January 23 to November 23)</Title1>
        <span>{medianBFSessions()}</span>

        <Title2>Issues</Title2>

        <p>Created issues: {createdIssuesCount}</p>
        <p>Closed issues: {closedIssuesCount}</p>
        <p>Remaining open issues:{openedIssuesCount}</p>

        <Title2>Discussions</Title2>

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
      </Stack>
    </ResponsiveLayout>
  );
};

export default Wrapped2023;
