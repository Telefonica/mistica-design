import { ButtonLink, ResponsiveLayout, useTheme } from "@telefonica/mistica";
import "./dashboard.css";

const Dashboard = () => {
  const theme = useTheme();

  return (
    <ResponsiveLayout>
      <ButtonLink to={`/`}>Back to home</ButtonLink>
      <div id="analytics" data-theme={theme.isDarkMode ? "dark" : "light"}>
        <div class="sections">
          <div class="section">
            <div class="section_metadata">
              <a name="open-issues-by-type"></a>
              <h2 class="section_title">Open Issues by Type</h2>

              <div class="description">
                Queries of issues by type, using their label.
              </div>
            </div>
            <div class="section_widgets">
              <div class="number_widgets">
                <a name="new-components"></a>
                <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22New%20component%20%F0%9F%94%B8%22">
                  <div class="number_widget tertiary">
                    <span class="title">New components</span>
                    <span class="value">0</span>
                  </div>
                </a>
                <a name="component-requests"></a>
                <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22request%20%E2%9C%A8%22">
                  <div class="number_widget primary">
                    <span class="title">Component requests</span>
                    <span class="value">8</span>
                  </div>
                </a>
                <a name="bugs"></a>
                <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22bug%20%F0%9F%90%9E%22">
                  <div class="number_widget secondary">
                    <span class="title">Bugs</span>
                    <span class="value">6</span>
                  </div>
                </a>
              </div>
              <div class="table_widget">
                <a name="new-components-list"></a>
                <h3 class="table_title">
                  <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22New%20component%20%F0%9F%94%B8%22">
                    New components list
                  </a>
                </h3>
                <table class="table">
                  <tr class="table_header">
                    <th>Issue</th>
                    <th>Date</th>
                    <th>Title</th>
                  </tr>
                </table>
              </div>
              <div class="table_widget">
                <a name="component-request-list"></a>
                <h3 class="table_title">
                  <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22request%20%E2%9C%A8%22">
                    Component request list
                  </a>
                </h3>
                <table class="table">
                  <tr class="table_header">
                    <th>Issue</th>
                    <th>Date</th>
                    <th>Title</th>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/959">
                        959
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/959">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/959">
                        Orchid colors in Telefónica brand
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/931">
                        931
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/931">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/931">
                        PinField component
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/897">
                        897
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/897">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/897">
                        Pause icon without circle
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/699">
                        699
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/699">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/699">
                        Evolve feedback info screen to allow custom icon
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/655">
                        655
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/655">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/655">
                        Navbar with white variant
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/654">
                        654
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/654">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/654">
                        Add character counter to other input fields
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/621">
                        621
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/621">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/621">
                        Evolve Chips to include navigation
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/441">
                        441
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/441">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/441">
                        Evolve Highlighted card w/ tag + text
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="table_widget">
                <a name="bugs-list"></a>
                <h3 class="table_title">
                  <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22bug%20%F0%9F%90%9E%22">
                    Bugs list
                  </a>
                </h3>
                <table class="table">
                  <tr class="table_header">
                    <th>Issue</th>
                    <th>Date</th>
                    <th>Title</th>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/971">
                        971
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/971">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/971">
                        Resized 1:1 image in list and allow change the size
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/849">
                        849
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/849">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/849">
                        IBAN and CreditCard Field
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/838">
                        838
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/838">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/838">
                        O2UK color libraries dark mode brand token improvement
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/780">
                        780
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/780">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/780">
                        Carousel and CenteredCarousel Arrows positioning issues
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/683">
                        683
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/683">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/683">
                        Native alert autolayout review
                      </a>
                    </td>
                  </tr>
                  <tr class="table_element">
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/487">
                        487
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/487">
                        2022-12-27
                      </a>
                    </td>
                    <td>
                      <a href="https://github.com/Telefonica/mistica-design/issues/487">
                        Snackbar specs update
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
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
                  <div class="graph_item primary">
                    <span class="graph_item_title">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A%3E2022-12-20">
                        <span class="title">7 days</span>
                      </a>
                    </span>
                    <span class="graph_item_value">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A%3E2022-12-20">
                        <span class="value" style={{ width: "7%" }}>
                          6
                        </span>
                      </a>
                    </span>
                  </div>
                  <div class="graph_item primary">
                    <span class="graph_item_title">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A%3E2022-12-12">
                        <span class="title">15 days</span>
                      </a>
                    </span>
                    <span class="graph_item_value">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A%3E2022-12-12">
                        <span class="value" style={{ width: "19%" }}>
                          16
                        </span>
                      </a>
                    </span>
                  </div>
                  <div class="graph_item primary">
                    <span class="graph_item_title">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A2022-11-27..2022-12-20">
                        <span class="title">30 days</span>
                      </a>
                    </span>
                    <span class="graph_item_value">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A2022-11-27..2022-12-20">
                        <span class="value" style={{ width: "20%" }}>
                          17
                        </span>
                      </a>
                    </span>
                  </div>
                  <div class="graph_item">
                    <span class="graph_item_title">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A2022-09-28..2022-11-27">
                        <span class="title">90 days</span>
                      </a>
                    </span>
                    <span class="graph_item_value">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A2022-09-28..2022-11-27">
                        <span class="value" style={{ width: " 52%" }}>
                          43
                        </span>
                      </a>
                    </span>
                  </div>
                  <div class="graph_item">
                    <span class="graph_item_title">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A2022-06-30..2022-10-28">
                        <span class="title">180 days</span>
                      </a>
                    </span>
                    <span class="graph_item_value">
                      <a href="https://github.com/Telefonica/mistica-design/issues?q=is%3Aopen%20is%3Aissue%20created%3A2022-06-30..2022-10-28">
                        <span class="value" style={{ width: "100%" }}>
                          82
                        </span>
                      </a>
                    </span>
                  </div>
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
                    <span class="value">0</span>
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
                  <tr class="table_header">
                    <th>Issue</th>
                    <th>Date</th>
                    <th>Title</th>
                  </tr>
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
