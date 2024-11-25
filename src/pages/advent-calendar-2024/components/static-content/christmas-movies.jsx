import { useState, useEffect } from "react";

const ChristmasMovies = () => {
  const titles = [
    "Gremlins",
    "Jingle All The Way",
    "Harry Potter and the Philosopher's Stone",
    "Resident Evil",
    "Love Actually",
    "Charlie and the Chocolate Factory",
  ];

  const [movies, setMovies] = useState({});

  useEffect(() => {
    const fetchMovies = async () => {
      const movieData = {};
      for (const title of titles) {
        try {
          // Make a GET request to the serverless function (proxy)
          const response = await fetch(
            `/api/fetchMovies?title=${encodeURIComponent(title)}`
          );
          const data = await response.json();

          if (response.ok) {
            movieData[title] = data; // Store the fetched movie data
          } else {
            console.error(`Error fetching ${title}:`, data.error);
            movieData[title] = { Error: data.error };
          }
        } catch (error) {
          console.error(`Error fetching ${title}:`, error);
          movieData[title] = { Error: "Failed to fetch movie" };
        }
      }
      setMovies(movieData); // Save all fetched data in state
    };

    fetchMovies();
  }, []);

  return (
    <div>
      {titles.map((title) => (
        <div key={title}>
          <h2>{title}</h2>
          {movies[title]?.Error ? (
            <p>Error: {movies[title].Error}</p>
          ) : movies[title] ? (
            <>
              <p>{movies[title].Title || "Unknown Title"}</p>
              <img src={movies[title].Poster || ""} alt={title} />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChristmasMovies;
