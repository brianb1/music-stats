// music-stats
// by James Vaughan


// State

// Initial state
const state = {
  page: 1,
  loading: false
}


// Functions

// Shorthand function for convenience
const $ = selector => document.querySelector(selector)

// Construct a url for the given page and number of tracks
const url = (pageNum, numTracks) =>
  `http://ws.audioscrobbler.com/2.0/?`
    + `method=user.getRecentTracks`
    + `&limit=${numTracks}`
    + `&page=${pageNum}`
    + `&user=magicjamesv`
    + `&api_key=9cec0534e60b827aab0ae1b3e91baf82`
    + `&format=json`

// Get the pageNumth page of numTracks recent tracks
const fetchTracks = (pageNum, numTracks) =>
  fetch(url(pageNum, numTracks))
    .then(result => result.json())
    .then(({recenttracks}) => recenttracks.track)

// Get the next 20 tracks and append them to the document
const fetchRecentTracks = page =>
  fetchTracks(page, 20)
    .then(tracks => {
      $("#tracks").innerHTML +=
        tracks
          .slice(1)
          .map(({url, name, artist, image}) => `
            <a class="track" href=${url} target="_blank">
              <h5>${name} by ${artist['#text']}</h5>
              <img src=${image[image.length > 1 ? 1 : 0]['#text']}>
            </a>`)
          .join('')
      state.loading = false
    })


// Script

// Infinite scroll
onscroll = () => {
  if (!state.loading && (innerHeight + scrollY) >= document.body.offsetHeight) {
    state.loading = true
    fetchRecentTracks(state.page++)
  }
}

// Get the first page of tracks
fetchRecentTracks(1)

// Get and display the currently playing or latest played track
fetchTracks(1, 1).then(([{name, artist, album, image}]) =>
  $("#now-playing").innerHTML = `
    <div class="nine columns">
      <h4 style="margin-bottom: 10">${name}</h4>
      <h5 id="current-info">
        ${artist['#text']} - <i>${album['#text']}</i>
      </h5>
    </div>
    <div class="three columns">
      <img src="${image[image.length - 1]['#text']}"
        style="max-width: 100%; height: auto">
    </div>`)
