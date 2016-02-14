// Main.js

var App = React.createClass({
	render: function () {
		return (
			<div>
				<NowPlaying />
				<hr />
				<TrackList />
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
				url: ''
			}
		};
	},
	componentDidMount: function () {
		this.trackRequest = $.get('nowPlaying', function (result) {
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
				<h6 className="section-header">Now Playing</h6>
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
		this.trackRequest = $.get('recentTracks', {
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
			<div>
				<h6 className="section-header">Recent Plays</h6>
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
			<div className="track">
				<a href={this.props.track.url}>
					<h5>{this.props.track.title} by {this.props.track.artist}</h5>
				</a>
				<img src={this.props.track.icon} />
			</div>
		);
	}
});

ReactDOM.render(
	<App />,
	document.getElementById('app')
);
