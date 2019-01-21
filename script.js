'use strict';
const GBKey = '4b9c2a43261b7540c1f412f7e3c3fec306c286a4';

const YoutubeKey = 'AIzaSyCPGJrolRVRl2XdQOfBQ2T__evHvY6iORA';

const TwitchKey = 'kag0cgmqyb5oj3jbqaihjgtdavnqcf';

function hideMainPage() {
  $('h1').css('display', 'none');
  $('form').css('top', '3.5%');
}

function formatURL(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayGBResults(result) {
  console.log(result);
  return `
  <div class="gb-items">
    <div class="gb-image">
      <img src="${result.image.medium_url}" class="cardImage">
    </div>
    <div class="gb-content">
      <h2 class="description-text">${result.name}</h2>
      <p class="deck">${result.deck}</p>
    </div>
  </div>`;
}

function displayYoutubeResults(youtubeJson) {
  console.log(youtubeJson);
  $('.yt-videos').html(
    `<h2>Youtube Videos</h2>
          <div class="youtube-container"> 
            <div class="youtube">
              <iframe class="youtube-video" src="https://www.youtube.com/embed/${youtubeJson[0].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
            </div>
          <div class="youtube">
              <iframe class="youtube-video" src="https://www.youtube.com/embed/${youtubeJson[1].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
          </div>
            <div class="youtube">
              <iframe class="youtube-video" src="https://www.youtube.com/embed/${youtubeJson[2].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
          </div>
          <div class="youtube">
              <iframe class="youtube-video" src="https://www.youtube.com/embed/${youtubeJson[3].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
          </div>
            <div class="youtube">
              <iframe class="youtube-video" src="https://www.youtube.com/embed/${youtubeJson[4].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
          </div>
        </div>`
  );
  hideMainPage();
}

function displayTwitchResults(twitchJson) {
  console.log(twitchJson);
  $('.twitch-videos').html(
    `<h2>Twitch Vids</h2>
      <div class="twitch-container">
        <div class="twitch">
          <iframe class="twitch-video" src="https://player.twitch.tv/?channel=${twitchJson[0].channel.name}" autoplay="false" width="200" height="200" frameborder="0" allowFullScreen></iframe>
        </div>
      </div>`
  );
}

function getYoutubeVideos(searchTerm) {
  const searchURL = 'https://www.googleapis.com/youtube/v3/search';
  const apiKey = 'AIzaSyCPGJrolRVRl2XdQOfBQ2T__evHvY6iORA';
  const params = {
    key: apiKey,
    q: `${searchTerm} gameplay`,
    part: 'snippet',
    maxResults: 5,
    type: 'video'
  };
  const queryString = formatURL(params);
  const ytUrl = searchURL + '?' + queryString;

  console.log(ytUrl);

  fetch(ytUrl)
    .then(youtube => {
      if(youtube.ok) {
        return youtube.json();
      }
      throw new Error(youtube.statusText);
    })
    .then(youtubeJson => displayYoutubeResults(youtubeJson.items))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getTwitchVideos(searchTerm) {
  const searchURL = 'https://api.twitch.tv/kraken/streams/';
  const apiKey = 'kag0cgmqyb5oj3jbqaihjgtdavnqcf';
  const params = {
    client_id: apiKey,
    game: searchTerm,
    query: searchTerm,
    stream_type: 'live',
    format: 'jsonp',
    limit: 5,
  };
  const queryString = formatURL(params);
  const twitchUrl = searchURL + '?' + queryString;

  console.log(twitchUrl);

  fetch(twitchUrl)
    .then(twitch => {
      if(twitch.ok) {
        console.log(twitch.json());
        return twitch.json();
      }
      throw new Error(twitch.statusText);
    })
    .then(twitchJson => displayTwitchResults(twitchJson.streams))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getGBResults(searchTerm) {
  const searchURL = 'https://api.giantbomb.com/games/';
  const apiKey = '4b9c2a43261b7540c1f412f7e3c3fec306c286a4';
  $.ajax({
    url: searchURL,
    dataType: 'jsonp',
    data: {
      api_key: apiKey,
      format: 'jsonp',
      json_callback: 'gameCallback',
      filter: `name:${searchTerm}`,
      limit: 1
    }
  });
}

function gameCallback(data) {
  const results = data.results.map((item, index) => displayGBResults(item));
  $('.gb-info').html(results);
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getYoutubeVideos(searchTerm);
    getTwitchVideos(searchTerm);
    getGBResults(searchTerm);
    displayGBResults();
    displayYoutubeResults();
    displayTwitchResults();
  });
}

$(watchForm);