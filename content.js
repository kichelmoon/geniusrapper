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
        let text = getSelectionText();

        let songName = document.getElementsByClassName("header_with_cover_art-primary_info-title")[0].innerHTML;
        let artist = document.getElementsByClassName("song_album-info-artist")[0].innerHTML;
        let album = document.getElementsByClassName("song_album-info-title")[0].innerHTML;
        alert(songName);
    }
}