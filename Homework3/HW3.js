// set the dimensions and margins of the graph
var margin = { top: 30, right: 50, bottom: 10, left: 50 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// Loading data
var cols = ['artists', 'album_name', 'track_name', 'popularity', 'duration_ms', 'explicit', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'time_signature', 'track_genre']
var track_genre_types = ['acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime', 'black-metal', 'bluegrass', 'blues', 'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical', 'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 'french', 'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle', 'heavy-metal', 'hip-hop', 'honky-tonk', 'house', 'idm', 'indian', 'indie-pop', 'indie', 'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 'metal', 'metalcore', 'minimal-techno', 'mpb', 'new-age', 'opera', 'pagode', 'party', 'piano', 'pop-film', 'pop', 'power-pop', 'progressive-house', 'psych-rock', 'punk-rock', 'punk', 'r-n-b', 'reggae', 'reggaeton', 'rock-n-roll', 'rock', 'rockabilly', 'romance', 'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', "ska", "sleep", "songwriter", "soul", "spanish", "study", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "world-music"]

var spotify_tracks = []
d3.csv("http://vis.lab.djosix.com:2020/data/spotify_tracks.csv", function (data) {
  // d3.csv("spotify_tracks.csv", function (data) {
  // 151, 但實際只有150筆資料，用console可以發現最後一筆是undefined的
  // console.log("data.length: ", data.length)
  console.log("Loading data...")
  // console.log(data[0])
  for (var i = 0; i < data.length; i++) {
    spotify_tracks.push(data[i])
    // 將 False True 不能用成直方圖的值修改為數字
    spotify_tracks[i]['explicit'] = spotify_tracks[i]['explicit'] == "False" ? 0 : 1
    // Avoid string in number value
    // popularity	duration_ms		danceability	energy	key	loudness	
    // mode	speechiness	acousticness	instrumentalness	liveness	valence	tempo	time_signature
    spotify_tracks[i]['popularity'] = Number(spotify_tracks[i]['popularity'])
    spotify_tracks[i]['duration_ms'] = Number(spotify_tracks[i]['duration_ms'])
    spotify_tracks[i]['danceability'] = Number(spotify_tracks[i]['danceability'])
    spotify_tracks[i]['energy'] = Number(spotify_tracks[i]['energy'])
    spotify_tracks[i]['key'] = Number(spotify_tracks[i]['key'])
    spotify_tracks[i]['loudness'] = Number(spotify_tracks[i]['loudness'])
    spotify_tracks[i]['mode'] = Number(spotify_tracks[i]['mode'])
    spotify_tracks[i]['speechiness'] = Number(spotify_tracks[i]['speechiness'])
    spotify_tracks[i]['acousticness'] = Number(spotify_tracks[i]['acousticness'])
    spotify_tracks[i]['instrumentalness'] = Number(spotify_tracks[i]['instrumentalness'])
    spotify_tracks[i]['liveness'] = Number(spotify_tracks[i]['liveness'])
    spotify_tracks[i]['valence'] = Number(spotify_tracks[i]['valence'])
    spotify_tracks[i]['tempo'] = Number(spotify_tracks[i]['tempo'])
    spotify_tracks[i]['time_signature'] = Number(spotify_tracks[i]['time_signature'])


    // if(data[i]['speechiness']>=0.4) console.log(data[i])
    // console.log(data[i]['track_genre'])
    // colors.add(data[i]['track_genre'])
  }
  console.log("done!")
  // console.log(spotify_tracks)
  draw_page2(spotify_tracks, "popularity")
  draw_page3(spotify_tracks, "danceability", "popularity", "acoustic")
  draw_page4(spotify_tracks, "artists", "All")
  // draw_page5(spotify_tracks, ["popularity", "duration_ms", "danceability", "energy",  "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"])
});


// Colors for explicits
var explicits = ['Explicit FALSE', 'Explicit TRUE']
var color = d3.scaleOrdinal()
  .domain(explicits)
  .range(["#70D6FF", "#FF70A6"])

// Add track type dropsown menu 
class Add_options {
    constructor(name, which_cell) {
        this.name = name
        this.which_cell = "." + which_cell
        var op = new Option(this.name, this.name)
        document.querySelector(this.which_cell).appendChild(op)
    }
}
// Listener for change page
const toPage2 = d3.select(".toPage2")
  .on("click", function () {
    console.log("PAGE2 CLICK")
    d3.select("#page2_dataviz").style("display", "flex");
    d3.select("#page3_dataviz").style("display", "none");
    d3.select("#page4_dataviz").style("display", "none");
    d3.select("#page5_dataviz").style("display", "none");
    d3.select(".homepage").style("display", "none");
  })

const toPage3 = d3.select(".toPage3")
  .on("click", function () {
    console.log("PAGE3 CLICK")
    d3.select("#page2_dataviz").style("display", "none");
    d3.select("#page3_dataviz").style("display", "flex");
    d3.select("#page4_dataviz").style("display", "none");
    d3.select("#page5_dataviz").style("display", "none");
    d3.select(".homepage").style("display", "none");
  })

const toPage4 = d3.select(".toPage4")
  .on("click", function () {
    console.log("PAGE4 CLICK")
    d3.select("#page2_dataviz").style("display", "none");
    d3.select("#page3_dataviz").style("display", "none");
    d3.select("#page4_dataviz").style("display", "flex");
    d3.select("#page5_dataviz").style("display", "none");
    d3.select(".homepage").style("display", "none");
  })

var draw_page5_done = false
const toPage5 = d3.select(".toPage5")
  .on("click", function () {
    console.log("PAGE5 CLICK")
    d3.select("#page2_dataviz").style("display", "none");
    d3.select("#page3_dataviz").style("display", "none");
    d3.select("#page4_dataviz").style("display", "none");
    d3.select("#page5_dataviz").style("display", "flex");
    d3.select(".homepage").style("display", "none");
    if (!draw_page5_done) {
      page5_dataviz.selectAll("*").remove()
      draw_page5(spotify_tracks, ["popularity", "duration_ms", "danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"])
      draw_page5_done = true
    }
  })