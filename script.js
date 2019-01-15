'use strict';
const GiantbombKey = ' ';

const YoutubeKey = ' ';

const TwitchKey = ' ';

const GiantbombURL = 'https://www.giantbomb.com/api/games/';

const YoutubeURL = 'https://www.googleapis.com/youtube/v3/videos';

const TwitchURL = 'https://api.twitch.tv/kraken/streams/';

function hideMainPage() {
  $('h1').css('display', 'none');
  $('form').css('top', '3.5%');
}

function displayResults() {
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
           <h3>Videos</h3>
         </div>
         <div class="youtube">
           <h3>Videos</h3>
         </div>
         <div class="youtube">
           <h3>Videos</h3>
         </div>
         <div class="youtube">
           <h3>Videos</h3>
         </div>
       </div>
     </section>
     <section role="region" class="twitch-videos">
        <h2>Twitch Vids</h2>
        <div class="twitch-container">
            <div class="twitch">
                <h3>Videos</h3>
            </div>
            <div class="twitch">
                <h3>Videos</h3>
            </div>
            <div class="twitch">
                <h3>Videos</h3>
            </div>
            <div class="twitch">
                <h3>Videos</h3>
            </div>
        </div>
     </section>`
  );
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    displayResults();
    hideMainPage();
  });
}

$(watchForm);