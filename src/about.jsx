var React = require('react');

module.exports = React.createClass({
	render: function () {
		return (
			<div>
				<h6 className="section-header">What is this?</h6>
				<p>Have you ever wondered what music I'm listening to? Up until now, your options would have been pretty slim. You could have checked <a href="http://last.fm/user/magicjamesv" target="_blank">my last.fm profile</a>, <a href="http://jamesbvaughan.com" target="_blank">my main website</a>, or <a href="http://twitter.com/magicjamesmusic" target="_blank">@magicjamesmusic on Twitter</a>.</p>
				<p>Alright, you're probably thinking, "What is this guy talking about? I couldn't care less what music he's listening to! And publicizing his music history on that many different websites is kind of excessive." Okay, maybe that is a bit much, but I think that music sharing is really cool and building websites is even cooler, so this site's existence was really inevitable. My main motivation for creating it was to give me a project to learn a few new web technologies that I had been wanting to play around with.</p>
				<p>Right now you can see what I've been listening to most recently in the Recent Tracks section, and I'm working on adding some cool statistics to the Stats secion, so check back later for an update on that</p>
				<h6 className="section-header">Details for Nerds</h6>
				<p>When I started on this site, I was totally new to most of the tools and technologies that I used on it. The data is all coming from <a href="http://last.fm" target="_blank">Last.fm</a>, an amazing service that I strongly recommend to anyone who enjoys music. It has a bunch of cool features, but my favorite is what it calls "Scrobbling." Basically, it can log, or Scrobble, every song you ever listen to and make that data avaliable to you through its public API. On the backend I'm using Node and Express, and I'm using React, React Router, and Skeleton CSS on the front.</p>
				<p>Shoot me an email at <a href="mailto:james@jamesbvaughan.com?Subject=Music%20Stats" target="_blank">james@jamesbvaughan.com</a> if you have any questions or suggestions!</p>
			</div>
		);
	}
});
