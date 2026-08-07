export default async function handler(request, response) {
  const owner = "telefonica";
  const repo = "mistica-design";
  const year = 2023;
  const githubToken =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_GITHUB
      : process.env.GITHUB;

  let cursor = null;
  let allClosedDiscussions = [];
  const authorCounts = {};

  do {
    const graphqlQuery = `
      query($cursor: String) {
        repository(owner: "${owner}", name: "${repo}") {
          discussions(first: 100, after: $cursor, orderBy: { field: CREATED_AT, direction: DESC }) {
            totalCount
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              closed
              createdAt
              author {
                login
              }
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

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return response
        .status(apiResponse.status)
        .json({ error: "GitHub API request failed" });
    }

    const discussions = data.data.repository.discussions;
    cursor = discussions.pageInfo.hasNextPage
      ? discussions.pageInfo.endCursor
      : null;

    const filteredDiscussions = discussions.nodes.filter((discussion) => {
      const discussionDate = new Date(discussion.createdAt);
      return discussionDate.getFullYear() === year;
    });

    allClosedDiscussions = allClosedDiscussions.concat(filteredDiscussions);

    filteredDiscussions.forEach((discussion) => {
      if (discussion.closed) {
        const authorLogin = discussion.author.login;
        authorCounts[authorLogin] = (authorCounts[authorLogin] || 0) + 1;
      }
    });
  } while (cursor);

  // Sort authorCounts by discussionsCount in descending order
  const sortedAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([authorLogin, discussionsCount]) => ({
      authorLogin,
      discussionsCount,
    }));

  return response.status(200).json({
    closedDiscussions: allClosedDiscussions,
    mostActiveAuthors: sortedAuthors,
  });
}
