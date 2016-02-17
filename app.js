// Includes =====================================================
var express = require('express');
var compression = require('compression');
var webpack = require("webpack");
var path = require('path');
var lastfm = require(path.join(__dirname, 'modules/lastfm.js'));
var app = express();

// Last.fm ======================================================
var lf = lastfm({
	user: "magicjamesv",
	apiKey: "9cec0534e60b827aab0ae1b3e91baf82"
});


// Functions ====================================================
function printPlays(tracks, weeknum) {
	plays = 0;
	for (j = 0; j < tracks.length; j++) {
		plays += parseInt(tracks[j].playcount);
	}
	console.log("Week " + weekNum + ": " + plays);
}

function printWeeklyScrobbles() {
	lf.getWeeklyChartList(function (weeks) {
		for (i = 0; i < weeks.length; i++) {
			lf.getWeeklyTrackChart(weeks, i, printPlays);
		}
	});
}

// Express ======================================================
app.use(compression());

app.get('/api/nowPlaying', function (req, res) {
	lf.getRecentTracks(1, 1, function (tracks) {
		var track = tracks[0];
		res.send({
			artist: track.artist['#text'],
			title: track.name,
			album: track.album['#text'],
			cover: track.image[track.image.length - 1]['#text'],
			icon: track.image[1]['#text'],
			url: track.url,
			playing: track['@attr'] !== undefined
		});
	});
});

app.get('/api/recentTracks', function (req, res) {
	var page = req.query.page;
	var nTracks = 10;
	lf.getRecentTracks(nTracks, page, function (tracks) {
		var index = nTracks * (page - 1);
		trackList = tracks.slice(1).map(function (track) {
			return {
				key: index++,
				artist: track.artist['#text'],
				title: track.name,
				album: track.album['#text'],
				cover: track.image[track.image.length - 1]['#text'],
				icon: track.image[1]['#text'],
				url: track.url
			};
		});
		res.send(trackList);
	});
});

app.use(express.static(path.join(__dirname, 'public')));
function sendApp(req, res) {
	res.sendFile(path.join(__dirname, "public/index.html"));
}
app.get('/about', sendApp);
app.get('/stats', sendApp);
app.get('/recentTracks', sendApp);

app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function () {
	console.log("Server up and running on port", app.get("port"), "!");
});

// Webpack ======================================================
var compiler = webpack({
	entry: path.resolve(__dirname, 'src/main.jsx'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel',
				query: {
					presets: ['react']
				}
			},
			{
				test: /\.less$/,
				loader: 'style!css!less'
			},
			{
				test: /\.css/,
				loader: 'style!css'
			}
		]
	},
    resolve: {
		extensions: ['', '.js', '.jsx']
    }
});

compiler.watch({
	aggregateTimeout: 300,
	poll: true
}, function (err, stats) {
	if (err) {
		console.error(err);
	} else {
		console.log("Webpacked!");
	}
});
