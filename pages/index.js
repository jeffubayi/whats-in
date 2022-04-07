import Head from "next/head";
import axios from "axios";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, InputAdornment, TextField } from "@mui/material";
import { FormWrapper, PageWrapper } from "../styles";
import Alert from "../components/alert";
import { Key } from "react";
import {
  CardMedia,
  ImageListItem,
  ImageList,
  ImageListItemBar,
} from "@mui/material";
import { StyledRating } from "../styles";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import NoMovieAvailable from "../components/emptyMovie";

const Home = () => {
  //create the state for loading  movies
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("james bond");
  const [errorAlert, setErrorAlert] = useState(false);

  //handle movie search by name
  const searchMovies = async (event) => {
    event.preventDefault();
    const url = `http://www.omdbapi.com/?s=${query}&apikey=d3e8c483`;
    try {
      const response = await axios.get(url);
      const movieList = response.data.Search;
      setMovies(movieList);
      console.log(`moviesList `, movieList);
    } catch (error) {
      setErrorAlert(true);
      console.log(`error =>`, error);
    }
  };
  //handle text input value change
  function handleChange(event) {
    setQuery(event.target.value);
  }

  //set favorite movies
  const saveFavoriteMovie = (movieId) => {
    let favoriteList = [];
    let favMovieId = movieId;
    favoriteList.push(favMovieId);
    localStorage.setItem("movieId", favoriteList);
  };
  //get favorite movies
  let favoriteMovieId =
    typeof window !== "undefined" ? localStorage.getItem("movieId") : null;

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      {errorAlert && <Alert />}
      <PageWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <FormWrapper component="form" onSubmit={searchMovies}>
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
          {movies?.length ? (
            movies?.map((movie, index) => {
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
                                icon={<FavoriteIcon fontSize="inherit" />}
                                emptyIcon={
                                  <FavoriteBorderIcon fontSize="inherit" />
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
