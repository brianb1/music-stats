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

let counter = 0;

// Functions
function printTracks(page, nTracks) {
	lf.getRecentTracks(nTracks, page, tracks => {
		let trackList = tracks.slice(1).map(track => {
			return {
				artist: track.artist['#text'],
				title: track.name,
				mbid: track.mbid,
				album: track.album['#text'],
				date: track.date['#text']
			};
		});
		console.error(counter++, "/ 379");
		console.log(trackList);
	});
}

function getCharts() {
	lf.getWeeklyChartList(weeks => {
		for (var num in weeks) {
			lf.getWeeklyTrackChart(weeks, num, (tracks, weekNum) => {
				console.log(tracks.map(track => {
					return {
						artist: track.artist['#text'],
						title: track.name,
						album: track.album ? track.album['#text'] : '',
						cover: track.image[track.image.length - 1]['#text'],
						icon: track.image[1]['#text'],
						url: track.url
					};
				}));
			});
		}
	});
}

// Script
for (var i = 1; i <= 379; i++) {
	printTracks(i, 200);
}
// for (var i = 1; i <= 2; i++) {
// 	printTracks(i, 3);
// }
// getCharts();
