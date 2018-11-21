require("dotenv").config();
const inquirer = require("inquirer");
const axios = require("axios");

const spotifyId = process.env.SPOTIFY_ID;
const spotifySecret = process.env.SPOTIFY_SECRET;

// console.log(spotifyId,spotifySecret);

let bandUrl;
const bandsInTown = function(){
    inquirer.prompt([
        {
            type:"input",
            name:"artist",
            message: "Enter an artist to search events for"
        }
        ])
        .then(function(response){
            bandUrl = `https://rest.bandsintown.com/artists/${response.artist}/events?app_id=codingbootcamp`;
            console.log(bandUrl);
            axios.get(bandUrl)
            .then(function(response){
                let {data:artistData} = response;
                console.log(artistData.length);
            });
        });
};


//Initial prompt on application start to choose an action for LIRI
inquirer.prompt([
    {
      type: "list",
      name: "action",
      choices: ["Find Concert","Spotify A Song","Find Movie","Do What It Says"]
    },
    ])
    .then(function(response){
        switch (response.action){
            case "Find Concert":
                console.log(`Finding concert...`);
                bandsInTown();
                break;
            case "Spotify A Song":
                console.log(`Finding song...`);
                break;
            case "Find Movie":
                console.log(`Finding movie...`);
                break;
            case "Do What It Says":
                console.log(`Doing what it says...`);
                break;
        }
    })