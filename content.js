function getSelectionText() {
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
        text = document.selection.createRange().text;
    }

    return text;
}

if (window === top) {
    window.addEventListener('keyup', doKeyPress, false); //add the keyboard handler
}

let trigger_key = 71; // g key
function doKeyPress(e){
    if (e.shiftKey && e.keyCode === trigger_key){
        let pageHtml = document.documentElement.outerHTML;

        let youtubeRegex = new RegExp("(https?:\\/\\/)?(www\\.youtube\\.com|youtu\\.?be)\\/watch\\?v=[a-z0-9]+", "i");

        let text = getSelectionText();

        let songName = document.getElementsByClassName("header_with_cover_art-primary_info-title")[0].innerHTML.trim();
        let artist = document.getElementsByClassName("song_album-info-artist")[0].innerHTML.trim();
        let album = document.getElementsByClassName("song_album-info-title")[0].innerHTML.split(/<(.+)/)[0].trim();
        let year = document.getElementsByClassName("metadata_unit-info metadata_unit-info--text_only")[0].innerHTML.split(/,(.+)/)[1].trim();
        let geniusLink = window.location.href;
        let youtubeLink = pageHtml.match(youtubeRegex)[0];

        $.ajax({
            type: "GET",
            url: "https://api.spotify.com/v1/search?q=" + encodeURIComponent(album) + "&type=album&market=DE&limit=1",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Authorization: Bearer BQD3JedFfX_HUULhfcW7ru0jZ1QWc6qIFoE6-wc320wX3gNuLNXP7B-fFkMtWZakr7tbK8uy1a_wvPJOwE-rL2O1cKMrLneX21m5KSKciSbeNLxdeHGRH9N3zq9F-j36wUDJ8j4U8TYUu7vILBE"
            },
            success: function(data) {
                let albumId = data.albums.items[0].id;
                $.ajax({
                    type: "GET",
                    url: "https://api.spotify.com/v1/albums/" + albumId + "/tracks",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "token"
                    },
                    success: function(albumTrackData) {
                        let tracks = albumTrackData.items;
                        for(let i=0; i < tracks.length; i++) {
                            if (tracks[i].name === songName) {
                                spotifyLink = tracks[i].external_urls.spotify;

                                let returnObject = {
                                    "line": text,
                                    "song": songName,
                                    "artist": artist,
                                    "album": album,
                                    "year": year,
                                    "genius": geniusLink,
                                    "youtube": youtubeLink,
                                    "spotify": getSpotifyLink(album, songName)
                                };

                                console.log(returnObject);
                            }
                        }
                    },
                    dataType: "json"
                });
            },
            dataType: "json"
        });
    }
}