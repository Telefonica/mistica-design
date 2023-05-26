import {
  ButtonLink,
  ResponsiveLayout,
  useTheme,
  Tag,
  Touchable,
} from "@telefonica/mistica";
import { useEffect, useState } from "react";
import "./dashboard.css";

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

  return (
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

          <div class="section">
            <div class="section_metadata">
              <a name="open-issues-by-age"></a>
              <h2 class="section_title">Open Issues by Age</h2>

              <div class="description">
                Queries of open issues by their creation date.
              </div>
            </div>

            <div class="section_widgets">
              <div class="graph_widget">
                <a name="age"></a>
                <h3 class="graph_title">Age</h3>
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
                                  (filterIssuesByDate(issues, day).length /
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
            </div>
          </div>

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
  );
};

export default Dashboard;
