let res = [];

function getYoutubeVideoId(url) {
    var regExp = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    var match = url.match(regExp);

    if (!match) {
        return null;
    }

    var videoIdRegExp =
        /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
    var videoIdMatch = url.match(videoIdRegExp);

    return videoIdMatch && videoIdMatch[1] ? videoIdMatch[1] : null;
}

async function run() {
    document.getElementById("data").innerHTML = "";

    var url = document.getElementById("url").value;
    const linksArr = url.split(" ");
    for (let i = 0; i < linksArr.length; i++) {
        var videoId = getYoutubeVideoId(linksArr[i]);
        if (videoId === null) {
            alert("Not a valid URL!!!");
            return;
        }
        let response = await data(videoId, i);
        res.push(response);
    }

    document.getElementById("url").value = "";
    if (localStorage.getItem("apikey")) {
        const loader = document.getElementById("loader");
        loader.style.display = "block";

        window.aiResponse();
    } else {
        alert("Open menu and get a free API by clicking \"get api\"!!!");
        return;
    }
}

async function data(videoId, i) {
    let videoData = {};
    var apiURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&type=video&key=AIzaSyDsARzcDc-OiolLz4qG2a-yPRHhfxDrHSc`;
    await fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
            // Accessing the snippet part of the response
            const dataContainer = document.getElementById("data");
            let output = document.createElement("div");

            let imgURL = data.items[0].snippet.thumbnails.maxres.url;
            let tit = data.items[0].snippet.title;
            let des = data.items[0].snippet.description;
            let tg = data.items[0].snippet.tags;

            output.className = "output";
            let outputData = `
                                <img src="${data.items[0].snippet.thumbnails.maxres.url}" class="thumnail">
                                <p>${data.items[0].snippet.title}</p>
                                <span class="downloadThumbnail" onclick="downloadThumbnail(${i})">Download</span>
                                <button onclick="showDesc(${i})">Show Description</button>
                                <button onclick="showTags(${i})">Show Tags</button>
                            `;
            output.innerHTML = outputData;
            dataContainer.appendChild(output);
            videoData = { imgURL, tit, des, tg };
        })
        .catch((error) => {
            alert("Error fetching data:", error);
        });

    return videoData;
}
