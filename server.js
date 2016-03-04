// James' Music Stats Server
"use strict";

// Imports ======================================================
const path = require('path');
const dotenv = require('dotenv');
dotenv.load();

// Last.fm ======================================================
const lastfm = require(path.join(__dirname, 'src/lastfm.js'));
const lf = lastfm({
	user: "magicjamesv",
	apiKey: process.env.LASTFM_KEY
});

// Express ======================================================
const express = require('express');
const compression = require('compression');
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
if (process.env.NODE_ENV != "production") {
	const webpack = require("webpack");
	let compiler = webpack(require(path.resolve(__dirname, 'webpack.config.js')));
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
}
