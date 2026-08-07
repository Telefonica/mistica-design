export default async function handler(request, response) {
  try {
    const githubToken =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_GITHUB
        : process.env.GITHUB;
    const year = 2023;

    const owner = "telefonica";
    const repo = "mistica-design";

    const graphqlQuery = `
        query {
          createdIssues : search(query: "repo:${owner}/${repo} is:issue created:${year}-01-01..${year}-12-31", type: ISSUE) {
              issueCount
              }
          openIssues: search(query: "repo:${owner}/${repo} is:issue is:open created:${year}-01-01..${year}-12-31", type: ISSUE) {
            issueCount
          }
          closedIssues: search(query: "repo:${owner}/${repo} is:issue is:closed created:${year}-01-01..${year}-12-31", type: ISSUE) {
            issueCount
          }
        }
      `;

    const apiResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    if (!apiResponse.ok) {
      throw new Error(
        `GitHub API request failed with status: ${apiResponse.status}`
      );
    }

    const data = await apiResponse.json();
    const createdIssueCount = data.data.createdIssues.issueCount;
    const openIssueCount = data.data.openIssues.issueCount;
    const closedIssueCount = data.data.closedIssues.issueCount;

    return response.status(200).json({
      createdIssueCount,
      openIssueCount,
      closedIssueCount,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
