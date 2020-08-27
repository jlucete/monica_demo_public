// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
//let tag2 = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
//tag2.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
//var secondScriptTag = document.getElementsByTagName('script')[1];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//secondScriptTag.parentNode.insertBefore(tag2, secondScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player1;
let player2;
function onYouTubeIframeAPIReady() {
  player1 = new YT.Player('player', {
      height: '450',
      width: '100%',
      videoId: 'IkPKYheT9Xg',
  });
  /*
  player2 = new YT.Player('player2', {
    height: '285',
    width: '100%',
    videoId: 'ehH9OQMQXIk',
  });
  */
}
