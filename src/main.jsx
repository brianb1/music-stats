// Main.js
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
					<IndexLink activeClassName="active" to="/">Recent Tracks</IndexLink>
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

var About = React.createClass({
	render: function () {
		return (
			<div>
				<SectionTitle>What is this?</SectionTitle>
				<p>Have you ever wondered what music I'm listening to? Up until now, your options would have been pretty slim. You could have checked <a href="http://last.fm/user/magicjamesv" target="_blank">my last.fm profile</a>, <a href="http://jamesbvaughan.com" target="_blank">my main website</a>, or <a href="http://twitter.com/magicjamesmusic" target="_blank">@magicjamesmusic on Twitter</a>.</p>
				<p>Alright, you're probably thinking, "What is this guy talking about? I couldn't care less what music he's listening to! And publicizing his music history on that many different websites is kind of excessive." Okay, maybe that is a bit much, but I think that music sharing is really cool and building websites is even cooler, so this site's existence was really inevitable. My main motivation for creating it was to give me a project to learn a few new web technologies that I had been wanting to play around with.</p>
				<p>Right now you can see what I've been listening to most recently in the Recent Tracks section, and I'm working on adding some cool statistics to the Stats secion, so check back later for an update on that</p>
				<SectionTitle>Details for Nerds</SectionTitle>
				<p>When I started on this site, I was totally new to most of the tools and technologies that I used on it. The data is all coming from <a href="http://last.fm" target="_blank">Last.fm</a>, an amazing service that I strongly recommend to anyone who enjoys music. It has a bunch of cool features, but my favorite is what it calls "Scrobbling." Basically, it can log, or Scrobble, every song you ever listen to and make that data avaliable to you through its public API. On the backend I'm using Node and Express, and I'm using React, React Router, and Skeleton CSS on the front.</p>
				<p>Shoot me an email at <a href="mailto:james@jamesbvaughan.com?Subject=Music%20Stats" target="_blank">james@jamesbvaughan.com</a> if you have any questions or suggestions!</p>
			</div>
		);
	}
});

var Stats = React.createClass({
	render: function () {
		return (
			<SectionTitle>(Stats coming soon!)</SectionTitle>
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

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={RecentTracks} />
			<Route path="/about" component={About} />
			<Route path="/stats" component={Stats} />
		</Route>
	</Router>,
	document.getElementById('app')
);
