const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

//import 
const Song = require("./song"); 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/music',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>
{console.log("connected to mongo");
}).catch((err)=>
{
    console.log("connection eror:",err);
});

app.get('/', (req, res) => {
    res.send("Welcome to the music app!");
  });

/* const data=[{
  songName:"aayat",
  director:"sanjay",
  film:"bajirao",
  singer:"arijit",
},
{
  songName:"teri jhuki nazar",
  director:"sanjay",
  film:"murder",
  singer:"arijit",
}]
Song.insertMany(data); */



//get request1-get total number of documents and songs
app.get("/songs",async(req,res)=>{
    try{
        const totalCount = await Song.countDocuments();
        const songs = await Song.find();
        res.json({totalCount,songs});
    }
    catch(error){
        res.status(500).send("error retrieving songs");
    }
});

//get request2 - get song directed by some director
app.get('/songs/director/:director', async (req, res) => {
    const { director } = req.params; // Extracting the 'director' parameter from the URL
    try {
      const songs = await Song.find({ director }); // Query MongoDB for matching songs
      res.json(songs); // Return the list of songs as JSON
    } catch (error) {
      res.status(500).send('Error retrieving songs');
    }
  });


  //get request-3:songs and director
  app.get('/songs/director/:director/singer/:singer', async (req, res) => {
    const { director, singer } = req.params;

    try {
        const songs = await Song.find({ director, singer }); // Correctly query for songs with both director and sing
        res.json(songs); 
    } catch (error) {
        console.error("Error retrieving songs:", error); // Log the error for debugging
        res.status(500).json({ message: "Error retrieving songs" }); // More informative error message
    }
});

//deleting song
 app.get('/delete',async(req,res)=>{
  const result = await Song.deleteOne({songName:"saathiya"});
  res.send("song deleted successfully!");
  console.log("deleted the song!");
});

//updating a song 
app.get('/update', async (req, res) => {
  try {
    const result = await Song.updateMany(
      { songName: "aayat" }, // Query to find the documents to update
      { $set: { actorName: "ranveer", actressName: "deepika" } } // Update operation
    );

  } catch (error) {
    res.status(500).send("error!");
  }

});

//displaying all songs
app.get('/display-songs',async(req,res)=>{
  try{
    const songs = await Song.find();

    const html = `
    <html>
      <head>
        <title>user data</title>
      </head>
      <body>
        <h1>the data is:</h1>
        <table>
          <tr>
            <th>songName</th>
            <th>film</th>
            <th>director</th>
            <th>singer</th>
          </tr>
          ${songs.map(song=>`
          <tr>
            <td>${song.songName}</td>
            <td>${song.film}</td>
            <td>${song.director}</td>
            <td>${song.singer}</td>
          </tr>
          `).join('')}

        </table>
      </body>

    </html>`;
    res.send(html);
  }
  catch{
    res.status(500).send("error!");
  }
})




//starting th server
app.listen(3000,()=>{
    console.log("app running on port 3000!");
});

