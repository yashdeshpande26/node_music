const mongoose = require("mongoose");

// Define the schema for the songs collection
const songSchema = new mongoose.Schema({
  songName:String,
  film: String,
  director: String,
  singer: String,
  actorName:String,
  actressName:String,
});

// Create the Mongoose model from the schema
const Song = mongoose.model("Song", songSchema);

// Export the Song model
module.exports = Song;
