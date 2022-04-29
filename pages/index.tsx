import Head from "next/head";
import React, { useState, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { FormWrapper, PageWrapper } from "../styles";
import Alert from "../components/alert";
import { debounce } from "lodash";
import {
  CardMedia,
  ImageListItem,
  ImageList,
  ImageListItemBar,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { StyledRating } from "../styles";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import NoMovieAvailable from "../components/emptyMovie";

interface movies {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
}

const Home = () => {
  //create the state for loading  movies
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [open, setOpen] = useState(true);
  const closeAlert = () => {
    setOpen(false);
  };

  //handle movie search by name
  const searchMovies = async (event: any) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/getMoviesByName?name=${query}`);
      const movieList = await res.json();
      setMovies(movieList);
    } catch (error) {
      error && setErrorAlert(true);
    }
  };

  //set favorite movies
  const saveFavoriteMovie = (movieId: string) => {
    let favoriteList: any = [];
    let favMovieId = movieId;
    favoriteList.push(favMovieId);
    if (typeof window !== "undefined") {
      localStorage.setItem("movieId", favoriteList);
    }
  };
  //get favorite movies
  let favoriteMovieId =
    typeof window !== "undefined" ? localStorage.getItem("movieId") : null;
  //handle text input value change
  const handleChange = (event: any) => {
    setQuery(event.target.value);
    searchMovies(event);
  };

  // essential because if we don’t persist this data between re-renders
  // other implementations of debounce will occur on every re-render
  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  //clean up any side effects from debounce when our component gets unmounted
  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
    <>
      <Head>
        <title>Search</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"
          rel="stylesheet"
        />
      </Head>
      {errorAlert && <Alert open={open} closeAlert={closeAlert} />}
      <PageWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <FormWrapper component="div">
              <TextField
                size="small"
                onChange={handleChange}
                className="input"
                type="text"
                name="query"
                placeholder="Search movies..."
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormWrapper>
          </Grid>
          {(movies || {}).length ? (
            (movies || []).map((movie: any, index: any) => {
              return (
                <Grid key={index} item xs={6} md={2}>
                  <Link
                    href={{
                      pathname: `/detail`,
                      query: { imdbID: `${movie?.imdbID}` },
                    }}
                    passHref
                  >
                    <ImageList cols={1} sx={{ cursor: "pointer" }}>
                      <ImageListItem>
                        <CardMedia
                          sx={{ borderRadius: "0.3rem" }}
                          component="img"
                          width={220}
                          height={250}
                          title={movie?.Title}
                          image={
                            movie?.Poster !== "N/A"
                              ? `${movie?.Poster}`
                              : `no-movie.png`
                          }
                          alt="movie poster"
                        />
                        <ImageListItemBar
                          sx={{
                            background: "rgba(0, 0, 0, 0.85)",
                          }}
                          title={movie?.Title}
                          subtitle={movie?.Year}
                          actionIcon={
                            <IconButton
                              aria-label="add to favorites"
                              onClick={(event) => {
                                event.stopPropagation();
                                saveFavoriteMovie(movie?.imdbID);
                              }}
                            >
                              <StyledRating
                                size="large"
                                max={1}
                                defaultValue={
                                  movie?.imdbID === favoriteMovieId ? 1 : 0
                                }
                                icon={<FavoriteIcon sx={{ fill: "#ffff" }} />}
                                emptyIcon={
                                  <FavoriteBorderIcon sx={{ fill: "#ffff" }} />
                                }
                              />
                            </IconButton>
                          }
                          actionPosition="right"
                        />
                      </ImageListItem>
                    </ImageList>
                  </Link>
                </Grid>
              );
            })
          ) : (
            <NoMovieAvailable />
          )}
        </Grid>
      </PageWrapper>
    </>
  );
};

export default Home;
