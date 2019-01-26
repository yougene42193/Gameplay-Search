'use strict';

//moves the search bar up to the top after initial search
function searchBarChange() {
  $('h1').css('display', 'none');
  $('#js-search-term').css('border', '2px solid black');
  $('.landing-page').css('display', 'none');
  $('form').css('top', '27px');
  $('form').css('position', 'fixed');
  $('form').css('width', '90%');
}

function formatURL(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayGBResults(result) {
  return `
  <div class="gb-items">
    <div class="gb-image">
      <img src="${result.image.medium_url}" class="cardImage" alt="${result.name} image">
    </div>
    <div class="gb-content">
      <h2 class="description-text">${result.name}</h2>
      <p class="deck">${result.deck ? result.deck : 'Sorry, no description available for this game.'}</p>
    </div>
  </div>`;
}

function displayYoutubeResults(youtubeJson) {
  $('.yt-videos').empty();
  $('.yt-videos').html(
    `<h2>Youtube Gameplay Videos</h2>
       <div class="youtube-container">
       </div>`
  );
  if (youtubeJson.length > 0) {
    for(let i = 0; i < youtubeJson.length; i++) {
      $('.youtube-container').append(
        ` <div class="youtube">
            <iframe class="youtube-video" src="https://www.youtube.com/embed/${youtubeJson[i].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
          </div>`
      );
    }
  } else {
    $('.youtube-container').append(
      '<h3>No Videos Available</h3>'
    );
  }
}

function displayTwitchResults(twitchJson) {
  $('.twitch-videos').empty();
  $('.twitch-videos').html(
    `<h2>Twitch Live Streams</h2>
     <div class="twitch-container">
     </div>`
  );
  if (twitchJson.length > 0) {
    for(let i = 0; i < twitchJson.length; i++) {  
      $('.twitch-container').append(
        `<div class="twitch">
          <iframe class="twitch-video" src="https://player.twitch.tv/?channel=${twitchJson[i].channel.name}&autoplay=false" width="200" height="200" frameborder="0" scrolling="no" allowFullScreen="true"></iframe>
        </div>`
      );  
    }
  } else {
    $('.twitch-container').append(
      '<h3>No Live Streams</h3>'
    );
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
    success: callback,
    error: function(e) {
      console.log(e);
    }
  });
}

function gameCallback(data) {
  const results = data.results.map((item) => displayGBResults(item));
  if (results.length === 0) {
    $('.gb-info').html(
      '<h3>No Images and Content</h3>'
    );
  } else {
    $('.gb-info').html(results);
  }
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
  
  fetch(youtubeUrl)
    .then(youtube => {
      if(youtube.ok) {
        return youtube.json();
      }
      throw new Error(youtube.statusText);
    })
    .then(youtubeJson => displayYoutubeResults(youtubeJson.items, maxResult))
    .catch(err => {
      $('#js-error-msg').text(`Something went wrong: ${err.message}`);
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
      $('#js-error-msg').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResult = 5;
    searchBarChange();
    getGBResults(searchTerm, gameCallback);
    getYoutubeVideos(searchTerm, maxResult);
    getTwitchStreams(searchTerm, maxResult);
    $('#js-search-term').val('');
  });
}

$(watchForm);