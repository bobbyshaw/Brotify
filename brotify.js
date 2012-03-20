var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var playCount;
var apiKey = 'b25b959554ed76058ac220b7b2e0a026';
var scores = new Array;

exports.init = init;

function init() {

    updatePageWithTrackDetails();
	playCount = 0;	
	$('#playCount').text(playCount);
	getFriends();
    player.observe(models.EVENT.CHANGE, function (e) {

        // Only update the page if the track changed
        if (e.data.curtrack == true) {
            updatePageWithTrackDetails();
			playCount++;
			$('#playCount').text(playCount);
        }
    });
	
}

function updatePageWithTrackDetails() {

    var header = document.getElementById("subTitle");

    // This will be null if nothing is playing.
    var playerTrackInfo = player.track;

    if (playerTrackInfo == null) {
        header.innerText = "Nothing playing!";
    } else {
        var track = playerTrackInfo.data;
        header.innerHTML = track.name + " on the album " + track.album.name + " by " + track.album.artist.name + ".";
    }
}

function getFriends(){
	var user = 'cassanova1212';
	getTopArtists(user);
	$.get('http://ws.audioscrobbler.com/2.0/?method=user.getfriends&user='+user+'&api_key='+apiKey+'&format=json', function(data){
		jQuery.each(data.friends.user, function(i,val){
			getTopArtists(val.name);
		});
	});
	console.log(scores);
}
function getTopArtists(user){
	var playerTrackInfo = player.track;
	var track = playerTrackInfo.data;
	$.get('http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user='+user+'&period=7day&api_key=b25b959554ed76058ac220b7b2e0a026&format=json', function(data){
		parseTopArtists(data,user);
	});
	
}

function parseTopArtists(data,user){
	var score = 0;
	if (data.topartists.total == 0 ) return;
	jQuery.each(data.topartists.artist, function(i,val){
		if (val.playcount > 100 ){ score += 50; }
		else if (val.playcount  > 10) { score += 10; } 
		else { score += 1;}
    });
	$('#score').after(user + ' ' + score);
	$('#score').after('<br>');
}

function getLastFMShouts(){
 var header = document.getElementById("header");
 var playerTrackInfo = player.track;
 var track = playerTrackInfo.data;

 var req = new XMLHttpRequest();
    req.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.getshouts&artist=" + track.album.artist.name +  "&api_key=bba00ce37ccf60b79eea32a981c1da24&format=json", true);

    req.onreadystatechange = function() {

        console.log(req.status);

        if (req.readyState == 4) {
            if (req.status == 200) {
				var shouts = eval('(' + req.responseText + ')');
				parseLastFMShouts(shouts);
            }
        }
    };

    req.send();
}

function parseLastFMShouts(shouts){
	var result = '<ul>';
	jQuery.each(shouts.shouts.shout, function(i,val){
		result = result + '<li>' + val.body + '</li>'; 	
		if (i >= 19){
			return false;
		}
	});
	result = result + '</ul>';
	$('#lastFMshouts').html(result);
}

