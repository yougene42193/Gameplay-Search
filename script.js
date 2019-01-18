'use strict';
const GBKey = '4b9c2a43261b7540c1f412f7e3c3fec306c286a4';

const YoutubeKey = 'AIzaSyCPGJrolRVRl2XdQOfBQ2T__evHvY6iORA';

const TwitchKey = 'kag0cgmqyb5oj3jbqaihjgtdavnqcf';




const TwitchSearchURL = 'https://api.twitch.tv/kraken/streams/game';

function hideMainPage() {
  $('h1').css('display', 'none');
  $('form').css('top', '3.5%');
}

function formatURL(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(youtubeJson) {
  console.log(youtubeJson);
  $('#js-content').html(
    `<section role="region" class="gb-image">
        <h2>image</h2>
     </section>
     <section role="region" class="gb-content">
        <h2>summary</h2>
     </section>
     <section role="region" class="yt-videos">
       <h2>Youtube Videos</h2>
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
        </div>
    </section>
    `
  );
  hideMainPage();
}

function displayTwitchResults(twitchJson) {
  console.log(twitchJson);
  $('.twitch-videos').append(
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
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(youtube => {
      if(youtube.ok) {
        return youtube.json();
      }
      throw new Error(youtube.statusText);
    })
    .then(youtubeJson => displayResults(youtubeJson.items))
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
    limit: 5,
  };
  const queryString = formatURL(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
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
  const searchURL = 'https://www.giantbomb.com/api/search/';
  const apiKey = '4b9c2a43261b7540c1f412f7e3c3fec306c286a4';
  $.ajax({
    api_key: apiKey,
    query: searchTerm,
    resources: 'game',
    format: 'jsonp',
    limit: 1,
    crossDomain: true,
    jsonp: 'json_callback',
    url: searchURL,
    success: function(data) {
      console.log(data)
    }
  });
  const params = {
    
  };
  const queryString = formatURL(params);
  const GBURL = searchURL + '?' + queryString;

  console.log(GBURL);

  fetch(GBURL)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-msg').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getYoutubeVideos(searchTerm);
    getTwitchVideos(searchTerm);
    getGBResults(searchTerm);
    displayResults();
    displayTwitchResults();
  });
}

$(watchForm);