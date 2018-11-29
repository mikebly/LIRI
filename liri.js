require("dotenv").config();
const inquirer = require("inquirer");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const spotify = require('./keys').spotify


let artistUrl;
let artistEvents;
let movieUrl;
let imdbIds = [];
let moviesArray = [];
let sortedMovies = [];
let randomIndex;

const bandsInTownPrompt = function () { //prompt user for band to query for
    inquirer.prompt([
        {
            type: "input",
            name: "artist",
            message: "Enter an artist to search events for"
        }
    ])
        .then(function (response) {
            let query = response.artist;
            if(!query){
                query = 'Nickleback'; //lol nickleback
            }
            bandsInTown(query);
        });
};

const bandsInTown = function (query) { //search bands in town for te given artist, build search url from user input
    artistUrl = `https://rest.bandsintown.com/artists/${query}/events?app_id=codingbootcamp`;
    console.log(`Searching for events for ${query}`);
    updateLog(`Searching for events for ${query}\n`);
    axios.get(artistUrl)
        .then(function (response) {
            let { data: artistData } = response;
            //array of objects detailing concert events, loop over to display details
            artistEvents = artistData.map((event, index) => {
                let { venue: venueData, datetime: eventTime } = event;
                let dateObj = new Date(eventTime);
                let momentObj = moment(dateObj);
                let formattedDate = momentObj.format(`MMM Do YYYY`);
                console.log(`******Event ${index + 1} Information******`);
                updateLog(`******Event ${index + 1} Information******\n`);
                console.log(`Venue Name: ${venueData.name}`);
                updateLog(`Venue Name: ${venueData.name}\n`);
                console.log(`Location: ${venueData.city}, ${venueData.region}`);
                updateLog(`Location: ${venueData.city}, ${venueData.region}\n`);
                console.log(`Date: ${formattedDate}`);
                updateLog(`Date: ${formattedDate}\n`);
            });
            actionPrompt();
        })
        .catch(function (error) {
            console.log(error);
        });
};

const spotifyASongPrompt = function () { //prompt user for track name to query for
    inquirer.prompt([
        {
            type: "input",
            name: "song",
            message: "Enter a song to search Spotify for"
        }
    ])
        .then(function (response) {
            let query = response.song;
            if(!query){
                query = 'Tommy the Cat';
            }
            spotifyASong(query);
        });

};

const spotifyASong = function (query) { //query spotify for given track name
    console.log(`searching spotify for ${query}`);
    updateLog(`searching spotify for ${query}\n`);
    spotify.search({ type: "track", query: query })
        .then(data => {
            //console.log(data);
            //each result is stored in the response's tracks object
            const { items } = data.tracks;
            //loop over array of returned tracks objects
            items.map((item, index) => {
                //console.log(item);
                //deconstruct response object to to display given data
                const { preview_url: url, name: trackName } = item;
                const { name: artistName } = item.artists[0];
                const { name: albumName, release_date: date } = item.album;

                console.log(`-----Result ${index + 1}-----`);
                updateLog(`-----Result ${index + 1}-----\n`);
                console.log(`Track Name: ${trackName}`);
                updateLog(`Track Name: ${trackName}\n`);
                console.log(`Album: ${albumName}`);
                updateLog(`Album: ${albumName}\n`);
                console.log(`Artist: ${artistName}`);
                updateLog(`Artist: ${artistName}\n`);
                console.log(`Release Date: ${date}`);
                updateLog(`Release Date: ${date}\n`);
                console.log(`Spotify URL: ${url}`);
                updateLog(`Spotify URL: ${url}\n`);

            });
        actionPrompt();
        })
        .catch(error => { console.log(error) });
};

const searchOMDBPrompt = function () { //prompt user for a movie title to query for
    inquirer.prompt([
        {
            type: "input",
            name: "movie",
            message: "Enter a movie title to search OMDB for"
        }
    ])
        .then(function (response) {
            let query = response.movie;
            if(!query){
                query = 'Requiem for a Dream';
            }
            searchOMDB(query);
        });

};

const searchOMDB = function (query) { //query OMDB for the movie title
    //reset the arrays used for data sorting
    moviesArray = [];
    sortedMovies = [];
    imdbIds = [];
    //query for general search to get multiple results, not singular title search. Use the resulting IMDB id's to retrieve more detailed data with singular serach. The multiple title query returns less data than desired.
    console.log(`searching for ${query}`);
    updateLog(`searching for ${query}\n`);
    movieUrl = `http://www.omdbapi.com/?apikey=trilogy&s=${query}`;
    axios.get(movieUrl)
        .then(function (response) {
            //console.log(response.data.Search);
            let movieResults = response.data.Search;
            //push the returned movie's IMDB id
            movieResults.map(movie => {
                imdbIds.push(movie.imdbID);
            });
            //console.log(imdbIds);
            //for every movie, fetch data on each individual title to retreive detailed info
            imdbIds.map((imdbId, index) => {
                movieUrl = `http://www.omdbapi.com/?apikey=trilogy&i=${imdbId}`;
                axios.get(movieUrl)
                    .then(function (response) {
                        //console.log(response.data);
                        let { Title, Year, imdbRating, Country, Language, Plot, Actors, Ratings } = response.data;
                        console.log(`------Loading Movie Response ${index + 1}------`);
                        // console.log(Title);
                        // console.log(Year);
                        // console.log(imdbRating);
                        // console.log(Country);
                        // console.log(Language);
                        // console.log(Plot);
                        // console.log(Actors);
                        //console.log(Ratings[1]);


                        //since some movies do not have a "Ratings" key, push empty data so newMovie object can be made without errors
                        if (Ratings[0] === undefined) {
                            Ratings.push({ Value: "N/A" }, { Value: "N/A" });
                        }

                        if (Ratings[1] === undefined) {
                            Ratings.push({ Value: "N/A" });
                        }

                        //console.log(Ratings)

                        //grab desired data to push into moviesArray
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

                        //once the last api call is returned, print the data. since data returns unordered, first sort by the order it was requested
                        if (moviesArray.length === imdbIds.length) {
                            //console.log(moviesArray);
                            let sortedMovies = moviesArray.sort(function (a, b) {
                                return a.id - b.id;
                            });
                            //console.log(sortedMovies);

                            //once sorted, display details
                            sortedMovies.map(movie => {
                                console.log(`******Result ${movie.id + 1}******`);
                                updateLog(`******Result ${movie.id + 1}******\n`);
                                console.log(`Title: ${movie.title}`);
                                updateLog(`Title: ${movie.title}\n`);
                                console.log(`Released: ${movie.year}`);
                                updateLog(`Released: ${movie.year}\n`);
                                console.log(`IMDB Rating: ${movie.imdbRating}`);
                                updateLog(`IMDB Rating: ${movie.imdbRating}\n`);
                                console.log(`Rotten Tomato Score: ${movie.rottenTomatoScore}`);
                                updateLog(`Rotten Tomato Score: ${movie.rottenTomatoScore}\n`);
                                console.log(`Country of Origin: ${movie.country}`);
                                updateLog(`Country of Origin: ${movie.country}\n`);
                                console.log(`Language: ${movie.language}`);
                                updateLog(`Language: ${movie.language}\n`);
                                console.log(`Plot: ${movie.plot}`);
                                updateLog(`Plot: ${movie.plot}\n`);
                                console.log(`Actors: ${movie.actors}`);
                                updateLog(`Actors: ${movie.actors}\n`);
                                
                                
                            });
                            //return to prompt
                            actionPrompt();
                        }
                        
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

//select a command for LIRI randomly from random.txt to run.
//data in random.txt is stored as "action,parameter,..."
const doRandom = function () {
    fs.readFile('random.txt', 'utf-8', function (error, data) {
        if (error) {
            console.log(error);
        }
        console.log(data);
        const randomActions = data.split(",");
        console.log(randomActions);

        //since actions alternate with parameters in the array, take only even numbers
        randomIndex = Math.floor(Math.random() * (randomActions.length - 1));
        if (randomIndex % 2 !== 0) {
            randomIndex -= 1;
        }
        // console.log(randomIndex);
        // console.log(randomActions[randomIndex]);
        // console.log(randomActions[randomIndex + 1]);
        let randomAction = randomActions[randomIndex];
        let randomParameter = randomActions[randomIndex + 1]; //parameter is 1 index after action

        //run the chosen random action with its designated parameter
        switch (randomAction) {
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


function updateLog(str){
    let time = moment();
    fs.appendFile("log.txt",`${time}: ${str}`,function(error){
       if(error){
           console.log(error);
       }
       else{
        //   console.log(`appending to log.txt`);
       }
    });
}


//Prompt user to select an action for LIRI
function actionPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            choices: ["Find Concert", "Spotify A Song", "Find Movie", "I'm Feeling Lucky...","Quit"]
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
                case "Quit":
                    console.log(`Buuh Bye Now!`);
                    break;
            }
        });
}

//Start LIRI by initializing action prompt
actionPrompt();
