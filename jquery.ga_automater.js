// Function to set the event to be tracked:
function setDelayedEvent(label, value) {
  document.cookie='ev='+escape(label)+'!'+escape(value)+'; path=/; expires='+new Date(new Date().getTime()+60000).toUTCString();
}

ga_automater = function(options) {
  var settings = $.extend({}, {
    file_extensions: ['pdf', 'zip', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    target:''}, options);

  log_event = function(event,value){
    if (typeof(ga) != 'undefined') {
        ga('send', 'event', event, value);
    }else if(console != undefined){
      console.log('Google Analytics not found');
      console.log(event+ "***"+value);
    }
  }  

  //#1 LOG FILE CLICKS, OPEN FILES IN A NEW WINDOW
  //Loops through extensions. Add's target _blank and logs the click.
  for (x in settings.file_extensions){      
    $('a[href$="'+settings.file_extensions[x]+'"]').attr("target","_blank").click(function(){
      log_event('file_viewed',$(this).text());
    })
  }

  //#2 SET EVENT TO FORM SUBMISSIONS
  //Logs the form action of any submitted forms. Doesn't actual log until subsequent page loads.
  $('form').submit(function(){
    setDelayedEvent($(this).attr('action'),'submitted')
  });
  
  //#3 LOGS AND OPENS ANY OFFSITE LINKS IN A NEW WINDOW
  //A little computationally heavy since we loop through each anchor tag
  $('a').each(function() {
     var a = new RegExp('/' + window.location.host + '/');
     if(this.href.match(/^mailto\:/i)){
        log_event(this.href,'email clicked');
     }
     else if(this.href.match(/^tel\:/i)){
        log_event(this.href,'telephone clicked');
     }     
     else if (!a.test(this.href)) {
        $(this).addClass('ga_external_link').attr("target","_blank");
     }

  });





  //This code runs once per page. It checks other submits.
  //Liked the solution of letting the form submit, putting in local cookie
  //Once page is loaded snag the cookie then log it.
  //Won't work for forms that post off site unless the user comes back afterwards.
  //http://stackoverflow.com/questions/4086587/track-event-in-google-analytics-upon-clicking-form-submit
  var formErrorCount= formErrorCount || 0;
  var ev= document.cookie.match('(?:;\\s*|^)ev=([^!]+)!([^!]+)(?:;|\s*$)');
  if (ev && ev.length>2) {
    //console.log(ev);
    //TODO - not sure why utm is getting added. So splitting on semi colon for now.
    log_event(unescape(ev[1]), unescape(ev[2].split(';')[0]));
    document.cookie='ev=; path=/; expires='+new Date(new Date().getTime()-1000).toUTCString();
  }

};




