var express = require('express');
var lastfm = require('./lastfm.js');
var app = express();

var lf = lastfm({
	user: "magicjamesv",
	apiKey: "9cec0534e60b827aab0ae1b3e91baf82"
});

lf.getWeeklyChartList(function (weeks) {
	for (i = 0; i < weeks.length; i++) {
		lf.getWeeklyTrackChart(weeks, i, function (tracks, weekNum) {
			plays = 0;
			for (j = 0; j < tracks.length; j++) {
				plays += parseInt(tracks[j].playcount);
			}
			console.log("Week " + weekNum + ": " + plays);
		});
	}
});
