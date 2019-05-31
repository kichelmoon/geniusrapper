document.addEventListener('DOMContentLoaded', function () {
    let link = document.getElementById("spotifyLink");
    let linkLocation = link.href;
    link.onclick = function () {
        chrome.tabs.create({active: true, url: linkLocation});
    };
});

let tokenInput = document.getElementById("token");
let sendButton = document.getElementById("sendToken");
let csvButton = document.getElementById("downloadCsv");

sendButton.addEventListener('click', function () {
    let spotifyToken = tokenInput.value;
    alert("lol");
    chrome.storage.sync.set({token: spotifyToken}, function() {
        console.log("Token: " + spotifyToken)
    });
    chrome.storage.sync.set({csvRows: []}, function () {
        console.log("Reset rows");
    });
});

csvButton.addEventListener('click', function () {
    chrome.storage.sync.get(['csvRows'], function (result) {
        let lineArray = [];
        result.csvRows.forEach(function (infoArray, index) {
            let line = infoArray.join(";");
            lineArray.push(index === 0 ? "data:text/csv;charset=utf-8," + line : line);
        });
        let csvContent = lineArray.join("\n");

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link); // Required for FF

        link.click()
    });
    chrome.storage.sync.set({csvRows: []}, function () {
        console.log("Reset rows");
    })
});
