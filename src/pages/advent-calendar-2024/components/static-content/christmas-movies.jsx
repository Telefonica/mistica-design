import {
  Grid,
  GridItem,
  Stack,
  Text3,
  TextLink,
  useScreenSize,
} from "@telefonica/mistica";
import { useState, useEffect } from "react";
import ContentWrapper from "../content-wrapper";

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

  const { isMobile } = useScreenSize();

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
    <ContentWrapper maxWidth={860}>
      <Grid columns={isMobile ? 1 : 3} gap={16}>
        {titles.map((title) => (
          <GridItem key={title}>
            <div key={title}>
              <Stack space={16}>
                <Text3 weight="medium">{title}</Text3>
                {movies[title]?.Error ? (
                  <p>Error: {movies[title].Error}</p>
                ) : movies[title] ? (
                  <Stack space={16}>
                    <img
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "2/3",
                      }}
                      src={movies[title].Poster || ""}
                      alt={title}
                    />
                    <Text3>
                      <TextLink
                        href={`https://www.imdb.com/title/${movies[title].imdbID}/`}
                      >
                        See {movies[title].Title} in IMDB
                      </TextLink>
                    </Text3>
                  </Stack>
                ) : (
                  <p>Loading...</p>
                )}
              </Stack>
            </div>
          </GridItem>
        ))}
      </Grid>
    </ContentWrapper>
  );
};

export default ChristmasMovies;
