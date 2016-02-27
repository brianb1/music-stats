// James' module for getting data from Last.FM
"use strict";

const request = require('request');
const qs = require('qs');

const baseURL = "http://ws.audioscrobbler.com/2.0/?";
const trackLimit = 200;

module.exports = function (data) {
	return {
		user: data.user,
		apiKey: data.apiKey,
		getRecentTracks: function (songLimit, pageNum, callback) {
			let url = baseURL + qs.stringify({
				method: 'user.getRecentTracks',
				limit: songLimit,
				page: pageNum,
				user: this.user,
				api_key: this.apiKey,
				format: 'json'
			});
			request(url, (err, response, body) => {
				let data = JSON.parse(body);
				let tracks = data.recenttracks.track;
				callback(tracks);
			});
		},
		getWeeklyChartList: function (callback) {
			let url = baseURL + qs.stringify({
				method: 'user.getWeeklyChartList',
				user: this.user,
				api_key: this.apiKey,
				format: 'json'
			});
			request(url, (err, response, body) => {
				let data = JSON.parse(body);
				let weeks = data.weeklychartlist.chart;
				callback(weeks);
			});
		},
		getWeeklyTrackChart: function (weeks, weekNum, callback) {
			let url = baseURL + qs.stringify({
				method: 'user.getWeeklyTrackChart',
				user: this.user,
				from: weeks[weekNum].from,
				to: weeks[weekNum].to,
				api_key: this.apiKey,
				format: 'json'
			});
			request(url, (err, response, body) => {
				let data = JSON.parse(body);
				let tracks = data.weeklytrackchart.track;
				callback(tracks, weekNum);
			});
		}
	};
};
