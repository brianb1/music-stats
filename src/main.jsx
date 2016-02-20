// Main.js

// Sytlesheets
require('./styles.less');

// NPM Modules
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;
var IndexRoute = require('react-router').IndexRoute;
var Link = require('react-router').Link;
var IndexLink = require('react-router').IndexLink;

// My Components
var About = require('./about.jsx');
var Stats = require('./stats.jsx');
var RecentTracks = require('./recent-tracks.jsx');

var App = React.createClass({
	render: function () {
		return (
			<div>
				<nav className="navBar">
					<IndexLink activeClassName="active" to="/">Recent Tracks</IndexLink>
					<Link activeClassName="active" to="/stats">Stats</Link>
					<Link activeClassName="active" to="/about">About</Link>
				</nav>
				<hr style={{marginTop: '0'}} />
				{this.props.children}
			</div>
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
