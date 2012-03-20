var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var playCount;

exports.init = init;

function init() {

    updatePageWithTrackDetails();
	playCount = 0;	
	$('#playCount').text(playCount);
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
                console.log("Search complete!");
				console.log(req.responseText);
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

