// James' Music Stats Server
"use strict";

// Imports ======================================================
var path = require('path');

// Last.fm ======================================================
var lastfm = require(path.join(__dirname, 'modules/lastfm.js'));
var lf = lastfm({
	user: "magicjamesv",
	apiKey: "9cec0534e60b827aab0ae1b3e91baf82"
});

// Express ======================================================
var express = require('express');
var compression = require('compression');
var app = express();
app.use(compression());
app.get('/api/nowPlaying', (req, res) => {
	lf.getRecentTracks(1, 1, tracks => {
		let track = tracks[0];
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
app.get('/api/recentTracks', (req, res) => {
	let page = req.query.page || 1;
	let nTracks = req.query.ntracks || 10;
	lf.getRecentTracks(nTracks, page, tracks => {
		let trackList = tracks.slice(1).map(track => {
			return {
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

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
	console.log(`Server up and running on port ${app.get('port')}!`);
});

// Webpack ======================================================
var webpack = require("webpack");
var compiler = webpack(require(path.resolve(__dirname, 'webpack.config.js')));
compiler.watch({
	aggregateTimeout: 300,
	poll: true
}, (err, stats) => {
	if (err) {
		console.error(err);
	} else {
		console.log("Webpacked!");
	}
});
