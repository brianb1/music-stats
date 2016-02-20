"use strict";
var React = require('react');
var Waypoint = require('react-waypoint');
var Spinner = require('react-spin');

module.exports = React.createClass({
	render: function () {
		return (
			<div>
				<NowPlaying />
				<hr />
				<TrackList />
				<br />
			</div>
		);
	}
});

var NowPlaying = React.createClass({
	getInitialState: function () {
		return {
			track: {}
		};
	},
	componentDidMount: function () {
		this.trackRequest = $.get('api/nowPlaying', (result) => {
			this.setState({
				track: result
			});
		});
	},
	componentWillUnmount: function () {
		this.trackRequest.abort();
	},
	render: function () {
		return (
			<div>
				<h6 className="section-header">
					{this.state.track.playing ? "Now Playing" : "Lastest Track Played"}
				</h6>
				<div className="row">
					<div className="nine columns">
						<h4 style={{marginBottom: '10'}}>{this.state.track.title}</h4>
						<h5>
							{this.state.track.artist} -
							<i> {this.state.track.album}</i>
						</h5>
					</div>
					<div className="three columns">
						<img src={this.state.track.cover} style={{maxWidth: '100%', height: 'auto'}} />
					</div>
				</div>
			</div>
		);
	}
});

var TrackList = React.createClass({
	getInitialState: function () {
		return {
			page: 1,
			tracks: [],
			loading: false
		};
	},
	componentDidMount: function () {
		this.loadTracks(20);
	},
	loadTracks: function (nTracks) {
		this.setState({loading: true});
		this.trackRequest = $.get('api/recentTracks', {
			page: this.state.page,
			ntracks: nTracks
		}, result => {
			this.setState({
				tracks: this.state.tracks.concat(result),
				page: this.state.page + 1,
				loading: false
			});
		});
	},
	loadMore: function () {
		let n = this.state.tracks.length;
		if (n != 0) this.loadTracks(n < 200 ? n : 200);
	},
	componentWillUnmount: function () {
		this.trackRequest.abort();
	},
	render: function () {
		let tracks= [];
		this.state.tracks.forEach((track, key) => {
			tracks.push(
				<Track key={key} track={track} />
			);
		});
		let spinOptions = {
			className: 'my-spinner',
			position: 'relative',
			top: '20px',
			color: '#666',
			width: 1.5,
			length: 12
		};
		return (
			<div className="trackList">
				<h6 className="section-header">Recent Tracks</h6>
				<div className="tracks">
					{tracks}
				</div>
				<Waypoint onEnter={this.loadMore} />
				<Spinner config={spinOptions} stopped={!this.state.loading} />
			</div>
		);
	}
});

var Track = React.createClass({
	render: function () {
		return (
			<a className="track" href={this.props.track.url} target="_blank">
				<h5>{this.props.track.title} by {this.props.track.artist}</h5>
				<img src={this.props.track.icon} />
			</a>
		);
	}
});
