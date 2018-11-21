require("dotenv").config();
const inquirer = require("inquirer");
const axios = require("axios");
const moment = require("moment");

const spotifyId = process.env.SPOTIFY_ID;
const spotifySecret = process.env.SPOTIFY_SECRET;

// console.log(spotifyId,spotifySecret);

let artistUrl;
let artistEvents;

const bandsInTown = function(){
    inquirer.prompt([
        {
            type:"input",
            name:"artist",
            message: "Enter an artist to search events for"
        }
        ])
        .then(function(response){
            artistUrl = `https://rest.bandsintown.com/artists/${response.artist}/events?app_id=codingbootcamp`;
            console.log(artistUrl);
            axios.get(artistUrl)
            .then(function(response){
                let {data:artistData} = response;
                //console.log(artistData); //array of objects detailing concert events
                artistEvents = artistData.map((event,index)=>{
                    let {venue:venueData,datetime:eventTime} = event;
                    let dateObj = new Date(eventTime);
                    let momentObj = moment(dateObj);
                    let formattedDate = momentObj.format(`MMM Do YYYY`);
                    console.log(`******Event ${index} Information******`);
                    console.log(`Venue Name: ${venueData.name}`);
                    console.log(`Location: ${venueData.city}, ${venueData.region}`);
                    console.log(`Date: ${formattedDate}`);
                });
                
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