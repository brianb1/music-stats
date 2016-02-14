var express = require('express');
var lastfm = require('./js/lastfm.js');
var app = express();

var lf = lastfm({
	user: "magicjamesv",
	apiKey: "9cec0534e60b827aab0ae1b3e91baf82"
});

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

app.get('/nowPlaying', function (req, res) {
	lf.getRecentTracks(1, 1, function (tracks) {
		var track = tracks[0];
		res.send({
			artist: track.artist['#text'],
			title: track.name,
			album: track.album['#text'],
			cover: track.image[track.image.length - 1]['#text'],
			icon: track.image[1]['#text'],
			url: track.url
		});
	});
});

app.get('/recentTracks', function (req, res) {
	var page = req.query.page;
	var nTracks = 10;
	lf.getRecentTracks(nTracks, page, function (tracks) {
		var index = nTracks * (page - 1);
		trackList = tracks.filter(function (track) {
			return track['@attr'] === undefined;
		}).map(function (track) {
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

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.use(express.static('./'));

app.listen(3000, function () {
	console.log("Server up and running on port 3000!");
});
