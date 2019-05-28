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
trigger_key = 71; // g key
function doKeyPress(e){
    if (e.shiftKey && e.keyCode === trigger_key){
        let pageHtml = document.documentElement.outerHTML;

        let youtubeRegex = new RegExp("(https?:\\/\\/)?(www\\.youtube\\.com|youtu\\.?be)\\/watch\\?v=[a-z0-9]+", "i");

        let text = getSelectionText();

        let songName = document.getElementsByClassName("header_with_cover_art-primary_info-title")[0].innerHTML.trim();
        let artist = document.getElementsByClassName("song_album-info-artist")[0].innerHTML.trim();
        let album = document.getElementsByClassName("song_album-info-title")[0].innerHTML.split(/<(.+)/)[0].trim();
        let geniusLink = window.location.href;
        let youtubeLink = pageHtml.match(youtubeRegex)[0];

        let returnObject = {
            "line": text,
            "song": songName,
            "artist": artist,
            "album": album,
            "genius": geniusLink,
            "youtube": youtubeLink
        };

        console.log(returnObject);
    }
}