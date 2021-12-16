const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const { tmdbKey, plexLink } = require('../config.json');

// Command: movie
// Description: Search for a movie and reply with an embed with the movie info
// Usage: /movie <movie name> <optional: year>
module.exports = {
  data: new SlashCommandBuilder()
    .setName('movie')
    .setDescription('Lookup informations about a movie')
    .addStringOption((option) =>
      option
        .setName('movietitle')
        .setDescription('the movie to get informations of')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('year')
        .setDescription('the year of the movie')
        .setRequired(false),
    ),
  async execute(interaction) {
    // Using deferReply because the movie search might take some time
    await interaction.deferReply();

    // Get the movie title and year
    const language = 'en-US';
    const movietitle = interaction.options.getString('movietitle');
    const year = interaction.options.getInteger('year');

    // Search the movie in TMDB and get the movieId
    const movieId = await axios
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&launguage=${language}&query=${movietitle}`,
      )
      .then((search_movie_response) => {
        if (search_movie_response.data.results.length == 0) {
          interaction.reply({
            content: 'No movie with that title found',
            ephemeral: true,
          });
          return;
        }
        if (year) {
          return search_movie_response.data.results.find(
            (movie) => movie.release_date.substring(0, 4) == year,
          ).id;
        }
        else {
          return search_movie_response.data.results[0].id;
        }
      });

    // Get the movie info based on the movieId
    const movieData = await axios
      .get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbKey}&language=${language}`,
      )
      .then((movie_response) => {
        return movie_response.data;
      });

    // get the cast data and format it to strings,one for actors and one for directors,
    // sorted by popularity
    const castData = await axios
      .get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${tmdbKey}`,
      )
      .then(function(cast_data) {
        let actorsString = '';
        let directorsString = '';
        cast_data.data.cast.sort((a, b) => {
          return b.popularity - a.popularity;
        });
        cast_data.data.cast.slice(0, 10).forEach((actor) => {
          actorsString += actor.name + ', ';
        });
        actorsString = actorsString.substr(0, actorsString.length - 2);

        const directors = cast_data.data.crew.filter(
          (crew_member) => crew_member.job == 'Director',
        );
        directors.forEach((director) => {
          directorsString += director.name + ', ';
        });
        directorsString = directorsString.substr(0, directorsString.length - 2);

        return { actors: actorsString, directors: directorsString };
      });

    // Check if the movie is in the Plex library
    const available = await axios
      .get(plexLink)
      .then((response) => {
        return response.data.MediaContainer.Metadata.some(
          (movie) =>
            movie.title == movieData.title ||
            movie.originalTitle == movieData.title,
        );
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    // Create the embed
    const movieEmbed = new MessageEmbed();

    // create the genres string from movieData.genres
    const genresString = movieData.genres
      ? movieData.genres.reduce((acc, genre, index) => {
        if (index == movieData.genres.length - 1) {
          return acc + genre.name;
        }
        else {
          return acc + genre.name + ', ';
        }
      }, '')
      : '';

    // create the runtime string from movieData.runtime
    const runtimeString = movieData.runtime
      ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m`
      : '';

    // set the embed fields
    movieEmbed.setTitle(movieData.title);
    if (runtimeString.length > 0) {movieEmbed.setTitle(movieEmbed.title + ' (' + runtimeString + ')');}
    movieEmbed.setURL(`https://www.imdb.com/title/${movieData.imdb_id}/`);

    if (movieData.overview) movieEmbed.setDescription(movieData.overview);
    if (movieData.poster_path) {
      movieEmbed.setThumbnail(
        `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movieData.poster_path}`,
      );
    }
    if (movieData.release_date) movieEmbed.setFooter(movieData.release_date);
    if (movieData.vote_average && movieData.vote_count) {
      movieEmbed.addField(
        'Rating',
        `${movieData.vote_average}/10 (${movieData.vote_count} votes)`,
        true,
      );
    }
    if (castData.directors) {movieEmbed.addField('Directors', castData.directors, true);}
    if (genresString) movieEmbed.addField('Genres', genresString, true);
    if (available) movieEmbed.addField('AzzFlix', ':white_check_mark:', true);
    else movieEmbed.addField('AzzFlix', ':x:', true);
    if (castData.actors) movieEmbed.addField('Actors', castData.actors);

    // send the embed
    await interaction.editReply({ embeds: [movieEmbed] });
  },
};
