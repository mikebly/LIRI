# LIRI
## A helpful friend for finding concerts, songs, and movies. You can find LIRI in the your nearest terminal.

### Features
* Easy to navigate UI with Inquirer.js
* Find Concert via Bands in Town
* Spotify a Song with Spotify API
* Search a movie with the Open Movie Database

#### Navigating the App
Scroll through the options for LIRI with the arrow keys, select items with the Enter key

#### Finding Concerts
Selecting the "Find Concert" action from the initial menu will prompt the user for an Artist name to search for. This dynamically generates a search url that will be called to with Axios. The data returned to the screen is the venue name, venue location, and event date.

#### Finding Songs
Selecting the "Spotify A Song" action prompts the user for a track name to query the Spotify API via the Node Spotify API. A Maximum of 20 results will be returned for matches. Response data includes Album Name, Artist, Release Year, and Spotify URL.

#### Finding Movies
