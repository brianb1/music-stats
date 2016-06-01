// music-stats
// by James Vaughan

// Initial State
const state = {
  page: 1,
  loading: false
}

// Functions
const $ = selector => document.querySelector(selector)

const url = (page, num) =>
  `http://ws.audioscrobbler.com/2.0/?`
    + `method=user.getRecentTracks`
    + `&limit=${num}`
    + `&page=${page}`
    + `&user=magicjamesv`
    + `&api_key=9cec0534e60b827aab0ae1b3e91baf82`
    + `&format=json`

const fetchTracks = (page, num) =>
  fetch(url(page, num))
    .then(result => result.json())
    .then(({recenttracks}) => recenttracks.track)

const fetchRecentTracks = page =>
  fetchTracks(page, 20).then(tracks => {
    $("#tracks").innerHTML +=
      tracks.slice(1)
        .map(({url, name, artist, image}) => `
          <a class="track" href=${url} target="_blank">
            <h5>${name} by ${artist['#text']}</h5>
            <img src=${image[image.length > 1 ? 1 : 0]['#text']}>
          </a>`)
        .join('')
    state.loading = false
  })


// Script
onscroll = () => {
  if (!state.loading &&
      (innerHeight + scrollY) >= document.body.offsetHeight) {
    state.loading = true
    fetchRecentTracks(state.page++)
  }
}

fetchRecentTracks(1)

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
