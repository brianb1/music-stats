// Main.js
// import { Router, Route, browserHistory, IndexRoute, Link, IndexLink } from 'react-router'
require('./normalize.css');
require('./skeleton.css');
require('./styles.less');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;
var IndexRoute = require('react-router').IndexRoute;
var Link = require('react-router').Link;
var IndexLink = require('react-router').IndexLink;

var App = React.createClass({
	render: function () {
		return (
			<div>
				<div className="u-max-full-width center">
					<h1>Music Stats</h1>
					<h5>by James Vaughan</h5>
				</div>
				<hr style={{marginBottom: '0px'}} />
				<nav className="navBar">
					<IndexLink activeClassName="active" to="/">Home</IndexLink>
					<Link activeClassName="active" to="/recentTracks">Recent Tracks</Link>
					<Link activeClassName="active" to="/stats">Stats</Link>
					<Link activeClassName="active" to="/about">About</Link>
				</nav>
				<hr style={{marginTop: '0px'}} />
				{this.props.children}
			</div>
		);
	}
});

var SectionTitle = React.createClass({
	render: function () {
		return (
			<h6 className="section-header">
				{this.props.children}
			</h6>
		);
	}
});

var Home = React.createClass({
	render: function () {
		return (
			<SectionTitle>Home</SectionTitle>
		);
	}
});

var Stats = React.createClass({
	render: function () {
		return (
			<SectionTitle>Stats</SectionTitle>
		);
	}
});

var RecentTracks = React.createClass({
	render: function () {
		return (
			<div>
				<NowPlaying />
				<hr />
				<TrackList />
				<hr />
			</div>
		);
	}
});

var NowPlaying = React.createClass({
	getInitialState: function () {
		return {
			track: {
				title: '',
				artist: '',
				album: '',
				cover: '',
				url: '',
				playing: false
			}
		};
	},
	componentDidMount: function () {
		this.trackRequest = $.get('api/nowPlaying', function (result) {
			this.setState({
				track: result
			});
		}.bind(this));
	},
	componentWillUnmount: function () {
		this.trackRequest.abort();
	},
	render: function () {
		return (
			<div>
				<SectionTitle>
					{this.state.track.playing ? "Now Playing" : "Lastest Track Played"}
					</SectionTitle>
					<div className="row">
					<div className="nine columns">
						<h4 style={{marginBottom: '10px'}}>{this.state.track.title}</h4>
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
			tracks: []
		};
	},
	componentDidMount: function () {
		this.loadTracks();
	},
	loadTracks: function () {
		this.trackRequest = $.get('api/recentTracks', {
			page: this.state.page
		}, function (result) {
			this.setState({
				tracks: this.state.tracks.concat(result),
				page: this.state.page + 1
			});
		}.bind(this));
	},
	componentWillUnmount: function () {
		this.trackRequest.abort();
	},
	render: function () {
		var tracks= [];
		this.state.tracks.forEach(function (track) {
			tracks.push(
				<Track key={track.key} track={track} />
			);
		});
		return (
			<div className="trackList">
				<SectionTitle>Recent Tracks</SectionTitle>
				{tracks}
				<div className="button-wrapper">
					<button onClick={this.loadTracks}>Load More</button>
				</div>
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

var About = React.createClass({
	render: function () {
		return (
			<SectionTitle>ABOUT</SectionTitle>
		);
	}
});

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="/recentTracks" component={RecentTracks} />
			<Route path="/about" component={About} />
			<Route path="/stats" component={Stats} />
		</Route>
	</Router>,
	document.getElementById('app')
);
