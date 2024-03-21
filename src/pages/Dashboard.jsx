import {
  ButtonLink,
  ResponsiveLayout,
  useTheme,
  Tag,
  Touchable,
  Inline,
  Box,
  Boxed,
  Icon,
  Text,
  Stack,
} from "@telefonica/mistica";
import { useEffect, useState } from "react";
import "./dashboard.css";
import AppLayout from "../components/app-layout";

const Dashboard = () => {
  const theme = useTheme();
  const [pulls, setPulls] = useState([]);
  const [issues, setIssues] = useState([]);
  const [closedIssues, setClosedIssues] = useState([]);
  const days = [7, 15, 30, 90, 180];

  function formatDate(dateStr) {
    const date = new Date(dateStr);

    // Check if date is Invalid
    if (isNaN(date.getTime())) {
      return "";
    }

    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  }

  function filterIssuesByDate(issues, days) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);
    thresholdDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00

    const filteredIssues = issues.filter((issue) => {
      // Exclude issues with "pull_request" property
      if (issue.pull_request) {
        return false;
      }

      const creationDate = new Date(issue.created_at);
      creationDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00

      return creationDate >= thresholdDate && creationDate <= currentDate;
    });

    return filteredIssues;
  }

  useEffect(() => {
    const fetchPulls = async () => {
      const response = await fetch(
        `https://api.github.com/repos/Telefonica/mistica-design/pulls?per_page=100`
      );
      const data = await response.json();
      setPulls(data.map((pull) => pull));
    };
    fetchPulls();

    const fetchIssues = async () => {
      const response = await fetch(
        `https://api.github.com/repos/Telefonica/mistica-design/issues?per_page=100`
      );
      const data = await response.json();
      setIssues(data.map((issue) => issue));
    };
    fetchIssues();

    const fetchClosedIssues = async () => {
      const response = await fetch(
        `https://api.github.com/repos/Telefonica/mistica-design/issues?state=closed&per_page=100`
      );
      const data = await response.json();
      setClosedIssues(data.map((issue) => issue));
    };
    fetchClosedIssues();
  }, []);

  const calculateMedianClosureTime = () => {
    const closureTimes = [];

    closedIssues.forEach((issue) => {
      if (issue.closed_at) {
        const createdAt = new Date(issue.created_at);
        const closedAt = new Date(issue.closed_at);

        // Calculate time taken to close the issue in milliseconds
        const closureTime = closedAt - createdAt;
        closureTimes.push(closureTime);
      }
    });

    // Sort the closure times
    const sortedTimes = closureTimes.sort((a, b) => a - b);

    // Calculate the median closure time in days
    let medianTime;
    const length = sortedTimes.length;
    if (length % 2 === 0) {
      const middleIndex = length / 2;
      medianTime =
        (sortedTimes[middleIndex - 1] + sortedTimes[middleIndex]) / 2;
    } else {
      const middleIndex = Math.floor(length / 2);
      medianTime = sortedTimes[middleIndex];
    }

    // Convert median time from milliseconds to days
    medianTime = medianTime / (1000 * 60 * 60 * 24);

    return medianTime;
  };

  const medianClosureTime = calculateMedianClosureTime().toFixed(2);

  return (
    <AppLayout>
      <ResponsiveLayout>
        <ButtonLink to={`/`}>Back to home</ButtonLink>
        <div id="analytics" data-theme={theme.isDarkMode ? "dark" : "light"}>
          <div class="sections">
            <div className="section">
              <div className="section_metadata">
                <a name="open-issues-by-type"></a>
                <h2 className="section_title">Open Issues by Type</h2>
                <div className="description">
                  Queries of issues by type, using their label.
                </div>
              </div>
              <div className="section_widgets">
                <div className="number_widgets">
                  {[
                    {
                      label: "New components",
                      className: "tertiary",
                      filter: "new",
                    },
                    {
                      label: "Component requests",
                      className: "primary",
                      filter: "request ✨",
                    },
                    { label: "Bugs", className: "secondary", filter: "bug 🐞" },
                  ].map((widget) => (
                    <a
                      href={`https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22${widget.filter}%22`}
                    >
                      <div className={`number_widget ${widget.className}`}>
                        <span className="title">{widget.label}</span>
                        <span className="value">
                          {
                            issues.filter((issue) =>
                              issue.labels.some(
                                (label) => label.name === widget.filter
                              )
                            ).length
                          }
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
                {[
                  { title: "New components list", label: "new" },
                  { title: "Component request list", label: "request ✨" },
                  { title: "Bugs list", label: "bug 🐞" },
                ].map((table) => (
                  <div className="table_widget">
                    <a name={`${table.label}-list`}></a>
                    <h3 className="table_title">
                      <a
                        href={`https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22${table.label}%22`}
                      >
                        {table.title}
                      </a>
                    </h3>
                    <table className="table">
                      <tr className="table_header">
                        <th>Issue</th>
                        <th>Title</th>
                        <th>Date</th>
                      </tr>
                      <tbody>
                        {issues
                          .filter((issue) =>
                            issue.labels.some(
                              (label) => label.name === table.label
                            )
                          )
                          .map((issue) => (
                            <tr key={issue.id}>
                              <td>
                                <a href={issue.html_url} target="_blank">
                                  <Tag type="active">#{issue.number}</Tag>
                                </a>
                              </td>
                              <td>{issue.title}</td>
                              <td>{formatDate(issue.created_at)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
            <Inline space={24} fullWidth>
              <div class="section" style={{ minWidth: "60vw" }}>
                <Boxed>
                  <Box padding={24}>
                    <Stack space={24}>
                      <Text size={14}>Open issues by age</Text>

                      <div class="graph_widget">
                        <div class="graph">
                          {days.map((day) => {
                            const fromDate = new Date();
                            fromDate.setDate(fromDate.getDate() - day);
                            const formattedFromDate = fromDate
                              .toISOString()
                              .slice(0, 10);

                            const url = `https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A%3E${formattedFromDate}%20is%3Aopen`;

                            return (
                              <div class="graph_item primary">
                                <span class="graph_item_title">
                                  <span class="title">{day} days</span>
                                </span>
                                <span class="graph_item_value">
                                  <a href={url} target="_blank">
                                    <span
                                      class="value"
                                      style={{
                                        width: `${
                                          (filterIssuesByDate(issues, day)
                                            .length /
                                            issues.length) *
                                          100
                                        }%`,
                                      }}
                                    >
                                      {filterIssuesByDate(issues, day).length}
                                    </span>
                                  </a>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Stack>
                  </Box>
                </Boxed>
              </div>
              <div class="section">
                <Stack space={24}>
                  <Boxed>
                    <Box padding={24}>
                      <Stack space={24}>
                        <Text size={32}>{medianClosureTime} days</Text>
                        <Text size={14}>Closure median time</Text>
                      </Stack>
                    </Box>
                  </Boxed>
                </Stack>
              </div>
            </Inline>

            <div class="section">
              <div class="section_metadata">
                <a name="pull-requests"></a>
                <h2 class="section_title">Pull Requests</h2>
              </div>

              <div class="section_widgets">
                <div class="number_widgets">
                  <a name="opened"></a>
                  <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Apr%20review%3Anone">
                    <div class="number_widget secondary">
                      <span class="title">Opened</span>
                      <span class="value">{pulls.length}</span>
                    </div>
                  </a>
                </div>

                <div class="table_widget">
                  <a name="open-pull-requests"></a>
                  <h3 class="table_title">
                    <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Apr%20review%3Anone%20sort%3Acreated-asc">
                      Open Pull Requests
                    </a>
                  </h3>
                  <table class="table">
                    <thead>
                      <tr class="table_header">
                        <th>PR</th>
                        <th>Title</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pulls.map((pull, index) => (
                        <tr class="table_row" key={index}>
                          <td>
                            <a href={pull.html_url} target="_blank">
                              <Tag type="active">#{pull.number}</Tag>
                            </a>
                          </td>
                          <td>{pull.title}</td>
                          <td>{formatDate(pull.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div id="footer">
            Generated by
            <a
              href="https://github.com/ethomson/issue-dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              ethomson/issue-dashboard
            </a>
          </div>
        </div>
      </ResponsiveLayout>
    </AppLayout>
  );
};

export default Dashboard;
