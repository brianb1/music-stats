const $ = selector => document.querySelector(selector)

let page = 1
let loading = false

const fetchTracks = (page, num, callback) =>
  fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&limit=${num}&page=${page}&user=magicjamesv&api_key=9cec0534e60b827aab0ae1b3e91baf82&format=json`)
    .then(result => result.json())
    .then(json => callback(json.recenttracks.track))

const fetchRecentTracks = page =>
  fetchTracks(page, 20, tracks => tracks.slice(1).forEach(track => {
    $("#tracks").innerHTML += `
      <a class="track" href=${track.url} target="_blank">
        <h5>${track.name} by ${track.artist['#text']}</h5>
        <img src=${track.image[track.image.length - 1]['#text']} />
      </a>`
    loading = false
  }))

fetchRecentTracks(1)

window.onscroll = () => {
  if (!loading && (window.innerHeight + window.scrollY)
      >= document.body.offsetHeight) {
    loading = true
    fetchRecentTracks(page++)
  }
}

fetchTracks(1, 1, tracks =>
  $("#now-playing").innerHTML = `
    <h6 class="section-header">
      ${tracks[0]['@attr'] === undefined ?
        "Lastest Track Played" : "Now Playing"}
    </h6>
    <div class="row">
      <div class="nine columns">
        <h4 style="margin-bottom: 10">${tracks[0].name}</h4>
        <h5 id="current-info">
          ${tracks[0].artist['#text']} - <i>${tracks[0].album['#text']}</i>
        </h5>
      </div>
      <div class="three columns">
        <img src="${tracks[0].image[tracks[0].image.length - 1]['#text']}"
          style="max-width: 100%; height: auto">
      </div>
  </div>`)
