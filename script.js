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
  console.log('twitch streams displaying');
  console.log(twitchJson);
  $('.twitch-videos').html(
    `<h2>Twitch Vids</h2>
      <div class="twitch-container">
        <div class="twitch">
          <iframe class="twitch-video" src="https://player.twitch.tv/?channel=${twitchJson[0].channel.name}&autoplay=false" width="200" height="200" frameborder="0" scrolling="no" allowFullScreen="true"></iframe>
        </div>
        <div class="twitch">
          <iframe class="twitch-video" src="https://player.twitch.tv/?channel=${twitchJson[1].channel.name}&autoplay=false" width="200" height="200" frameborder="0" scrolling="no" allowFullScreen="true"></iframe>
        </div>
        <div class="twitch">
          <iframe class="twitch-video" src="https://player.twitch.tv/?channel=${twitchJson[2].channel.name}&autoplay=false" width="200" height="200" frameborder="0" scrolling="no" allowFullScreen="true"></iframe>
        </div>
        <div class="twitch">
          <iframe class="twitch-video" src="https://player.twitch.tv/?channel=${twitchJson[3].channel.name}&autoplay=false" width="200" height="200" frameborder="0" scrolling="no" allowFullScreen="true"></iframe>
        </div>
        <div class="twitch">
          <iframe class="twitch-video" src="https://player.twitch.tv/?channel=${twitchJson[4].channel.name}&autoplay=false" width="200" height="200" frameborder="0" scrolling="no" allowFullScreen="true"></iframe>
        </div>
      </div>`
  );
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
  const results = data.results.map((item) => displayGBResults(item));
  $('.gb-info').html(results);
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
  const youtubeUrl = searchURL + '?' + queryString;

  console.log(youtubeUrl);

  fetch(youtubeUrl)
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

function getTwitchStreams(searchTerm) {
  const searchURL = 'https://api.twitch.tv/kraken/search/streams';
  const apiKey = 'kag0cgmqyb5oj3jbqaihjgtdavnqcf';
  const params = {
    game: searchTerm,
    query: searchTerm,
    stream_type: 'live',
    limit: 5,
  };
  const options = {
    method: 'GET',
    headers: new Headers ({
      'accept': 'application/json',
      'Client-ID': apiKey,
    })
  };
  const queryString = formatURL(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url, options)
    .then(twitch => {
      if(twitch.ok){
        return twitch.json();
      } else {
        throw new Error(twitch.statusText);
      }
    })
    .then(twitch => displayTwitchResults(twitch.streams))
    .catch(e => {
      console.log(e);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getGBResults(searchTerm);
    getYoutubeVideos(searchTerm);
    getTwitchStreams(searchTerm);
  });
}

$(watchForm);