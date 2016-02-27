// Main.js

// Sytlesheets
require('./styles.less');

// NPM Modules
const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const browserHistory = require('react-router').browserHistory;
const IndexRoute = require('react-router').IndexRoute;
const Link = require('react-router').Link;
const IndexLink = require('react-router').IndexLink;

// My Components
const About = require('./about.jsx');
const Stats = require('./stats.jsx');
const RecentTracks = require('./recent-tracks.jsx');

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
