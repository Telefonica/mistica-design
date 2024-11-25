import { Grid, GridItem, TextLink } from "@telefonica/mistica";
import { useState, useEffect } from "react";

const ChristmasMovies = () => {
  const titles = [
    "Gremlins",
    "Jingle All The Way",
    "Harry Potter and the Sorcerer's Stone",
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
      <Grid columns={3} gap={16}>
        {titles.map((title) => (
          <GridItem key={title}>
            <div key={title}>
              <h2>{title}</h2>
              {movies[title]?.Error ? (
                <p>Error: {movies[title].Error}</p>
              ) : movies[title] ? (
                <>
                  <p>{movies[title].Title || "Unknown Title"}</p>
                  <img src={movies[title].Poster || ""} alt={title} />
                  <TextLink
                    href={`https://www.imdb.com/title/${movies[title].imdbID}/`}
                  >
                    See {movies[title].title} in IMDB
                  </TextLink>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default ChristmasMovies;
