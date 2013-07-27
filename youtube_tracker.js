//This code is originally from
//www.lunametrics.com/blog and publicly distributed
//Modifications were made to log Google events slightly different.
//Comments were removed for readability.

//Originally
//Performed by LunaMetrics http://www.lunametrics.com @lunametrics 
//and Sayf Sharif @sayfsharif

//Modified by Ryan Doom

var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var videoArray = new Array();
var playerArray = new Array();

(function($) {
  function trackYouTube()
  {
    var i = 0;
    jQuery('iframe').each(function() {
      var video = $(this);
      if(video.attr('src')===undefined){
        var vidSrc = "";
      }else{
        var vidSrc = video.attr('src');
      }
      var regex = /https?\:\/\/www\.youtube\.com\/embed\/([\w-]{11})(?:\?.*)?/;
      var matches = vidSrc.match(regex);
      if(matches && matches.length > 1){
          videoArray[i] = matches[1];
          $(this).attr('id', matches[1]);
          i++;      
      }
    }); 
  }
  $(document).ready(function() {
    trackYouTube();
  });
})(jQuery);
function onYouTubeIframeAPIReady() {
  for (var i = 0; i < videoArray.length; i++) {
    playerArray[i] = new YT.Player(videoArray[i], {
      events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
      }
    });   
  }
}
function onPlayerReady(event) {
  //event.target.playVideo();
}
var _pauseFlag = false;
function onPlayerStateChange(event) { 
  videoarraynum = event.target.id - 1;
  if (event.data ==YT.PlayerState.PLAYING){
    _gaq.push(['_trackEvent', 'Videos', 'Play', videoArray[videoarraynum] ]); 
    _pauseFlag = false;
  } 
  if (event.data ==YT.PlayerState.ENDED){
    _gaq.push(['_trackEvent', 'Videos', 'Watch to End', videoArray[videoarraynum] ]); 
  } 
  if (event.data ==YT.PlayerState.PAUSED && _pauseFlag == false){
    _gaq.push(['_trackEvent', 'Videos', 'Pause', videoArray[videoarraynum] ]); 
    _pauseFlag = true;
  }
  if (event.data ==YT.PlayerState.BUFFERING){
    _gaq.push(['_trackEvent', 'Videos', 'Buffering', videoArray[videoarraynum] ]); 
  }
  if (event.data ==YT.PlayerState.CUED){
    _gaq.push(['_trackEvent', 'Videos', 'Cueing', videoArray[videoarraynum] ]); 
  } 
} 