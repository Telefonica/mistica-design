export default async function handler(req, res) {
  // Check if the method is GET
  if (req.method === "GET") {
    try {
      // Get the title from the query parameters
      const { title } = req.query;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      // Retrieve the OMDB API key from environment variables
      const apiKey = process.env.ADVENT_MOVIES;

      // Construct the OMDB URL with the title and API key
      const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(
        title
      )}&apikey=${apiKey}`;

      // Make the request to OMDB API
      const response = await fetch(omdbUrl);
      const data = await response.json();

      // Check if the response from OMDB is okay
      if (response.ok) {
        return res.status(200).json(data); // Return the movie data
      } else {
        return res
          .status(500)
          .json({ error: data.Error || "Failed to fetch movie data" });
      }
    } catch (error) {
      // Handle any errors that occur during the request
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // If method is not GET, return Method Not Allowed
    return res.status(405).json({ error: "Method not allowed" });
  }
}
