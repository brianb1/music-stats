var request = require('request');
var qs = require('qs');

var baseURL = "http://ws.audioscrobbler.com/2.0/?";
var trackLimit = 200;

module.exports = function (data) {
	return {
		user: data.user,
		apiKey: data.apiKey,
		getWeeklyChartList: function (callback) {
			url = baseURL + qs.stringify({
				method: 'user.getWeeklyChartList',
				user: this.user,
				api_key: this.apiKey,
				format: 'json'
			});
			request(url, function (err, response, body) {
				data = JSON.parse(body);
				weeks = data.weeklychartlist.chart;
				callback(weeks);
			});
		},
		getWeeklyTrackChart: function (weeks, weekNum, callback) {
			var url = baseURL + qs.stringify({
				method: 'user.getWeeklyTrackChart',
				user: this.user,
				from: weeks[weekNum].from,
				to: weeks[weekNum].to,
				api_key: this.apiKey,
				format: 'json'
			});
			request(url, function (err, response, body) {
				data = JSON.parse(body);
				tracks = data.weeklytrackchart.track;
				callback(tracks, weekNum);
			});
		}
	};
};
