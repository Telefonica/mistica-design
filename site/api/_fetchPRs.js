// Fetch PRs from repos

export default async function handler(request, response) {
  try {
    const githubToken = process.env.GITHUB_DEV;

    const owner = "telefonica";
    const repo = "mistica-ios";
    const year = 2023;
    let cursor = null;
    let allMergedPRs = [];

    do {
      const graphqlQuery = `
    query($cursor: String) {
      repository(owner: "${owner}", name: "${repo}") {
        mergedPRs: pullRequests(states: MERGED, first:100, after: $cursor){
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            createdAt
          }
        }
      }
    }
`;

      const apiResponse = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${githubToken}`,
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: { cursor },
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(
          `GitHub API request failed with status: ${apiResponse.status}`
        );
      }

      const data = await apiResponse.json();

      const mergedPRs = data.data.repository.mergedPRs;
      cursor = mergedPRs.pageInfo.hasNextPage
        ? mergedPRs.pageInfo.endCursor
        : null;

      const filteredPRs = mergedPRs.nodes.filter((PR) => {
        const PRDate = new Date(PR.createdAt);
        return PRDate.getFullYear() === year;
      });

      allMergedPRs = allMergedPRs.concat(filteredPRs);
    } while (cursor);

    return response.status(200).json({
      mergedPRs: allMergedPRs,
    });
  } catch (error) {
    console.error("Error fetching PRs:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
