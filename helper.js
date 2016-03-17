// Helper script used to get data for the stats
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

// Functions
function printTracks(page, nTracks) {
	lf.getRecentTracks(nTracks, page, tracks => {
		console.log(tracks);
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
		// console.log(trackList);
	});
}

// Script
printTracks(1, 5);
