function getSelectionText() {
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
        text = document.selection.createRange().text;
    }

    return text;
}

let trigger_key = 71; // g key
window.onkeypress = function(e) {
    if (e.shiftKey && e.keyCode === trigger_key) {
        let pageHtml = document.documentElement.outerHTML;

        let youtubeRegex = new RegExp("(https?:\\/\\/)?(www\\.youtube\\.com|youtu\\.?be)\\/watch\\?v=[a-z0-9]+", "i");

        let text = '"' + getSelectionText() + '"'; //"" for saving the newlines in excel

        let songName = document.getElementsByClassName("header_with_cover_art-primary_info-title")[0].innerHTML.trim();
        let artist = document.getElementsByClassName("song_album-info-artist")[0].innerHTML.trim();
        let album = document.getElementsByClassName("song_album-info-title")[0].innerHTML.split(/<(.+)/)[0].trim();
        let year = document.getElementsByClassName("metadata_unit-info metadata_unit-info--text_only")[0].innerHTML.split(/,(.+)/)[1].trim();
        let geniusLink = window.location.href;
        let youtubeLink = "todo";
        if(pageHtml.match(youtubeRegex) !== null) {
            youtubeLink = pageHtml.match(youtubeRegex)[0];
        }

        chrome.storage.sync.get(['token'], function(result) {
            $.ajax({
                type: "GET",
                url: "https://api.spotify.com/v1/search?q=" + encodeURIComponent(album) + "&type=album&market=DE&limit=1",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Authorization: Bearer " + result.token
                },
                success: function (data) {
                    let albumId = data.albums.items[0].id;
                    $.ajax({
                        type: "GET",
                        url: "https://api.spotify.com/v1/albums/" + albumId + "/tracks",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Authorization: Bearer " + result.token
                        },
                        success: function (albumTrackData) {
                            let tracks = albumTrackData.items;
                            for (let i = 0; i < tracks.length; i++) {
                                if (tracks[i].name === songName) {
                                    spotifyLink = tracks[i].external_urls.spotify;

                                    let csv = [text, artist, songName, youtubeLink, spotifyLink, geniusLink, album, year];
                                    chrome.storage.sync.get(["csvRows"], function(result) {
                                        let rowArray = result.csvRows;
                                        rowArray.push(csv);

                                        chrome.storage.sync.set({csvRows: rowArray}, function() {
                                            console.log("Saved a new array item");
                                            alert(text);
                                        });
                                    });
                                }
                            }
                        },
                        dataType: "json"
                    });
                },
                error: function () {
                    alert("Spotify macht Heckmeck, speichere ohne Link. Vielleicht Token erneuern.");
                    spotifyLink = "todo";

                    let csv = [text, artist, songName, youtubeLink, spotifyLink, geniusLink, album, year];
                    chrome.storage.sync.get(["csvRows"], function (result) {
                        let rowArray = result.csvRows;
                        rowArray.push(csv);

                        chrome.storage.sync.set({csvRows: rowArray}, function () {
                            console.log("Saved a new array item");
                            alert(text);
                        });
                    });
                },
                dataType: "json"
            });
        });
    }
};