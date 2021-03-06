# LIRI
## A helpful friend for finding concerts, songs, and movies. You can find LIRI in the your nearest terminal.

### Features
* Easy to navigate UI with Inquirer.js
* Find Concert via Bands in Town
* Spotify a Song with Spotify API
* Search a movie with the Open Movie Database

#### Navigating the App
Scroll through the options for LIRI with the arrow keys, select items with the Enter key to call upon LIRI's features. Once a query is performed, the user is returned to the initial prompt in order to perform more actions until "Quit" is selected.

![Initial Prompt](./images/initial.jpg)

#### Finding Concerts
Selecting the "Find Concert" action from the initial menu will prompt the user for an Artist name to search for. This dynamically generates a search url that will be called to with Axios. The data returned to the screen is the venue name, venue location, and event date.

![Finding concerts](./images/concert.jpg)

#### Finding Songs
Selecting the "Spotify A Song" action prompts the user for a track name to query the Spotify API via the Node Spotify API. A Maximum of 20 results will be returned for matches. Response data includes Album Name, Artist, Release Year, and Spotify URL.

![finding songs](./images/song.jpg)

#### Finding Movies
Selecting the "Find Movie" action will propt the user for a movie title to search the Open Movie Database, OMDB for. In order to retrieve multiple results, a search query is performed. This query only returns matching titles, their IMDB id and a picture. In order to return more meaningful data, an individual IMDB id query is performed for each of the search query's results.

![finding movies](./images/movie.jpg)
