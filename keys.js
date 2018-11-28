const Spotify = require("node-spotify-api");
console.log(`keys loaded`);
console.log(process.env.SPOTIFY_ID,process.env.SPOTIFY_SECRET)

exports.spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});