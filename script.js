'use strict';
const igdbKey = '';

const YoutubeKey = '';

const TwitchKey = ' ';

const igdbSearchURL = 'https://api-v3.igdb.com/games/';



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

function displayResults(responseJson) {
  $('#js-content').html(
    `<section role="region" class="gb-image">
        <h2>IMAGE</h2>
     </section>
     <section role="region" class="gb-content">
        <h2>Summary</h2>
     </section>
     <section role="region" class="yt-videos">
       <h2>Youtube Videos</h2>
       <div class="youtube-container"> 
         <div class="youtube">
         <iframe class="youtube-video" src="https://www.youtube.com/embed/${responseJson[0].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
         </div>
         <div class="youtube">
         <iframe class="youtube-video" src="https://www.youtube.com/embed/${responseJson[1].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
         </div>
         <div class="youtube">
         <iframe class="youtube-video" src="https://www.youtube.com/embed/${responseJson[2].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
         </div>
         <div class="youtube">
         <iframe class="youtube-video" src="https://www.youtube.com/embed/${responseJson[3].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
         </div>
         <div class="youtube">
         <iframe class="youtube-video" src="https://www.youtube.com/embed/${responseJson[4].id.videoId}" allow="autoplay" encrypted-media" width="200" height="200" frameborder="0" allowFullScreen></iframe>
         </div>
       </div>
     </section>
     <section role="region" class="twitch-videos">
        <h2>Twitch Vids</h2>
        <div class="twitch-container">
            <div class="twitch">
                <h3>Videos</h3>
            </div>
        </div>
     </section>`
  );
  hideMainPage();
}

function getYoutubeVideos(searchTerm) {
  const searchURL = 'https://www.googleapis.com/youtube/v3/search';
  const apiKey = '';
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
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(reponseJson => displayResults(reponseJson.items))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getIGDBResults(searchTerm) {
  const params = {
    name: searchTerm,
    'user-key': igdbKey,
  };
  const queryString = formatURL(params);
  const igdbURL = igdbSearchURL + '?' + queryString;

  console.log(igdbURL);

  fetch(igdbURL)
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
    getIGDBResults(searchTerm);
    displayResults();
    
  });
}

$(watchForm);