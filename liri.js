require("dotenv").config();
const inquirer = require("inquirer");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const spotifyId = process.env.SPOTIFY_ID;
const spotifySecret = process.env.SPOTIFY_SECRET;
const fs = require("fs");

const spotify = new Spotify({
    id: spotifyId,
    secret: spotifySecret
});

// console.log(spotifyId,spotifySecret);

let artistUrl;
let artistEvents;
let movieUrl;
let imdbIds = [];
let moviesArray = [];
let randomIndex;

const bandsInTownPrompt = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "artist",
            message: "Enter an artist to search events for"
        }
    ])
        .then(function (response) {
            let query = response.artist;
            bandsInTown(query);
        });
};

const bandsInTown = function(query){
    artistUrl = `https://rest.bandsintown.com/artists/${query}/events?app_id=codingbootcamp`;
            console.log(artistUrl);
            axios.get(artistUrl)
                .then(function (response) {
                    let { data: artistData } = response;
                    //console.log(artistData); //array of objects detailing concert events
                    artistEvents = artistData.map((event, index) => {
                        let { venue: venueData, datetime: eventTime } = event;
                        let dateObj = new Date(eventTime);
                        let momentObj = moment(dateObj);
                        let formattedDate = momentObj.format(`MMM Do YYYY`);
                        console.log(`******Event ${index+1} Information******`);
                        console.log(`Venue Name: ${venueData.name}`);
                        console.log(`Location: ${venueData.city}, ${venueData.region}`);
                        console.log(`Date: ${formattedDate}`);
                    });

                })
                .catch(function(error){
                    console.log(error);
                });
};

const spotifyASongPrompt = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "song",
            message: "Enter a song to search Spotify for"
        }
    ])
        .then(function (response) {
            let query = response.song;
            spotifyASong(query);
        });

};

const spotifyASong = function(query){
    console.log(`searching for ${query}`);
            spotify.search({ type: "track", query: query })
                .then(data => { console.log(data) })
                .catch(error => { console.log(error) });
};

const searchOMDBPrompt = function(){
    inquirer.prompt([
        {
            type:"input",
            name:"movie",
            message:"Enter a movie title to search OMDB for"
        }
    ])
    .then(function(response){
        let query = response.movie;
        searchOMDB(query);
    });
    
};

const searchOMDB = function(query){
    console.log(`searching for ${query}`);
        movieUrl = `http://www.omdbapi.com/?apikey=trilogy&s=${query}`;
        axios.get(movieUrl)
        .then(function(response){
            //console.log(response.data.Search);
            let movieResults = response.data.Search;
            movieResults.map(movie=>{
                imdbIds.push(movie.imdbID);
            });
            //console.log(imdbIds);
            imdbIds.map((imdbId,index)=>{
                movieUrl = `http://www.omdbapi.com/?apikey=trilogy&i=${imdbId}`;
                axios.get(movieUrl)
                .then(function(response){
                    //console.log(response.data);
                    let {Title, Year, imdbRating, Country, Language, Plot, Actors, Ratings } = response.data;
                    console.log(`******Loading Movie Response ${index+1}******`);
                    // console.log(Title);
                    // console.log(Year);
                    // console.log(imdbRating);
                    // console.log(Country);
                    // console.log(Language);
                    // console.log(Plot);
                    // console.log(Actors);
                    //console.log(Ratings[1]);


                    //since some movies do not have a "Ratings" key, push empty data so newMovie can be made without errors
                    if(Ratings[0] === undefined){
                        Ratings.push({Value:"N/A"},{Value:"N/A"});
                    }

                    if(Ratings[1] === undefined){
                        Ratings.push({Value:"N/A"});
                    }
                    
                    //console.log(Ratings)

                    let newMovie = {
                        id: index,
                        title: Title,
                        year: Year,
                        imdbRating: imdbRating,
                        rottenTomatoScore: Ratings[1].Value,
                        country: Country,
                        language: Language,
                        plot: Plot,
                        actors: Actors
                    };
                    moviesArray.push(newMovie);

                    //once the last api call is returned, print the data
                    if(moviesArray.length === imdbIds.length){
                        //console.log(moviesArray);
                        let sortedMovies = moviesArray.sort(function(a,b){
                            return a.id - b.id;
                        });
                        //console.log(sortedMovies);

                        sortedMovies.map(movie=>{
                            console.log(`******Result ${movie.id+1}******`);
                            console.log(`Title: ${movie.title}`);
                            console.log(`Released: ${movie.year}`);
                            console.log(`IMDB Rating: ${movie.imdbRating}`);
                            console.log(`Rotten Tomato Score: ${movie.rottenTomatoScore}`);
                            console.log(`Country of Origin: ${movie.country}`);
                            console.log(`Language: ${movie.language}`);
                            console.log(`Plot: ${movie.plot}`);
                            console.log(`Actors: ${movie.actors}`);
                        });
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
            });
        })
        .catch(function(error){
            console.log(error);
        });
};

const doRandom = function(){
    fs.readFile('random.txt', 'utf-8',function(error,data){
       if(error){
           console.log(error);
       }
       console.log(data);
       const randomActions = data.split(",");
       console.log(randomActions);
       
       randomIndex = Math.floor(Math.random()*(randomActions.length-1));
       if(randomIndex % 2 !== 0){
           randomIndex -= 1;
       }
       console.log(randomIndex);
       console.log(randomActions[randomIndex]);
       console.log(randomActions[randomIndex+1]);
       let randomAction = randomActions[randomIndex];
       let randomParameter = randomActions[randomIndex+1];
       
       switch (randomAction){
           case "Find Concert":
                console.log(`Finding concert...`);
                bandsInTown(randomParameter);
                break;
            case "Spotify A Song":
                console.log(`Finding song...`);
                spotifyASong(randomParameter);
                break;
            case "Find Movie":
                console.log(`Finding movie...`);
                searchOMDB(randomParameter);
                break;
       }
       
    });
};


//Initial prompt on application start to choose an action for LIRI
inquirer.prompt([
    {
        type: "list",
        name: "action",
        choices: ["Find Concert", "Spotify A Song", "Find Movie", "I'm Feeling Lucky..."]
    },
])
    .then(function (response) {
        switch (response.action) {
            case "Find Concert":
                console.log(`Finding concert...`);
                bandsInTownPrompt();
                break;
            case "Spotify A Song":
                console.log(`Finding song...`);
                spotifyASongPrompt();
                break;
            case "Find Movie":
                console.log(`Finding movie...`);
                searchOMDBPrompt();
                break;
            case "I'm Feeling Lucky...":
                console.log(`Doing what it says...`);
                doRandom();
                break;
        }
    })