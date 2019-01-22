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
  $('.yt-videos').empty();
  $('.yt-videos').html(
    `<h2>Youtube Gameplay Videos</h2>
       <div class="youtube-container">
       </div>`
  );
  for(let i = 0; i < youtubeJson.length; i++) {
    $('.youtube-container').append(
      ` <div class="youtube">
          <iframe class="youtube-video" src="https://www.youtube.com/embed/${youtubeJson[i].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
        </div>`
    );
  }
  
}

function displayTwitchResults(twitchJson) {
  console.log('twitch streams displaying');
  console.log(twitchJson.length);
  $('.twitch-videos').empty();
  $('.twitch-videos').html(
    `<h2>Twitch Live Streams</h2>
     <div class="twitch-container">
     </div>`
  );
  for(let i = 0; i < twitchJson.length; i++) {
    if (twitchJson.length > 0) {
      $('.twitch-container').append(
        `<div class="twitch">
          <iframe class="twitch-video" src="https://player.twitch.tv/?channel=${twitchJson[i].channel.name}&autoplay=false" width="200" height="200" frameborder="0" scrolling="no" allowFullScreen="true"></iframe>
        </div>`
      );  
    } else {
      $('.twitch-container').append(
        '<h3>No Results</h3>'
      );
    }
  }
}

function getGBResults(searchTerm, callback) {
  const searchURL = 'https://www.giantbomb.com/api/search/';
  const apiKey = '4b9c2a43261b7540c1f412f7e3c3fec306c286a4';
  $.ajax({
    url: searchURL,
    data: {
      api_key: apiKey,
      query: searchTerm,
      format: 'jsonp',
      resources: 'game',
      limit: 1
    },
    type: 'GET',
    dataType: 'jsonp',
    crossdomain: true,
    jsonp: 'json_callback',
    success: callback
  });
}

function gameCallback(data) {
  const results = data.results.map((item) => displayGBResults(item));
  $('.gb-info').html(results);
}

function getYoutubeVideos(searchTerm, maxResult) {
  const searchURL = 'https://www.googleapis.com/youtube/v3/search';
  const apiKey = 'AIzaSyCPGJrolRVRl2XdQOfBQ2T__evHvY6iORA';
  const params = {
    key: apiKey,
    q: `${searchTerm} gameplay`,
    part: 'snippet',
    maxResults: maxResult,
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
    .then(youtubeJson => displayYoutubeResults(youtubeJson.items, maxResult))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getTwitchStreams(searchTerm, maxResult) {
  const searchURL = 'https://api.twitch.tv/kraken/search/streams';
  const apiKey = 'kag0cgmqyb5oj3jbqaihjgtdavnqcf';
  const params = {
    game: searchTerm,
    query: searchTerm,
    stream_type: 'live',
    limit: maxResult,
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
    .then(twitchJson => displayTwitchResults(twitchJson.streams, maxResult))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResult = 5;
    hideMainPage();
    getGBResults(searchTerm, gameCallback);
    getYoutubeVideos(searchTerm, maxResult);
    getTwitchStreams(searchTerm, maxResult);
  });
}

$(watchForm);