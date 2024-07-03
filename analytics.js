let res = [];

function getYoutubeVideoId(url) {
    var regExp = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    var match = url.match(regExp);

    if (!match) {
        return null;
    }

    var videoIdRegExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
    var videoIdMatch = url.match(videoIdRegExp);

    return (videoIdMatch && videoIdMatch[1]) ? videoIdMatch[1] : null;
}


async function run() {
    var url = document.getElementById('url').value;
    const linksArr = url.split(" ");
    for (let i = 0; i < linksArr.length; i++) {
        var videoId = getYoutubeVideoId(linksArr[i]);
        if (videoId === null) {
            alert("Not a valid URL!!!");
            return;
        }
        let response = await data(videoId, i);
        res.push(response)
    }
    url = '';

    if (localStorage.getItem('apikey')) {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        window.aiResponse();
    }
    else {
        alert("Please enter the API key first to use ai!!!");
        return;
    }
}

async function data(videoId, i) {
    let videoData = {};
    var apiURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&type=video&key=AIzaSyDsARzcDc-OiolLz4qG2a-yPRHhfxDrHSc`;
    await fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            // Accessing the snippet part of the response
            const dataContainer = document.getElementById('data');

            // output container
            let output = document.createElement('div');
            output.setAttribute('class', 'output');

            // thumbnail
            let img = document.createElement('img');
            let imgURL = data.items[0].snippet.thumbnails.maxres.url;
            img.setAttribute('src', imgURL);
            img.setAttribute('class', 'thumnail')
            output.appendChild(img);

            // title
            let title = document.createElement('p');
            let tit = data.items[0].snippet.title;
            title.innerText = tit;
            output.appendChild(title)

            // download thumbnail
            let downloadThumbnailbtn = document.createElement('span');
            downloadThumbnailbtn.className = 'downloadThumbnail';
            downloadThumbnailbtn.textContent = 'Download';
            downloadThumbnailbtn.setAttribute('onclick', `downloadThumbnail(${i})`);
            output.appendChild(downloadThumbnailbtn);

            // description
            // let desc = document.createElement('p');
            let des = data.items[0].snippet.description;
            // desc.innerText = des;
            // output.appendChild(desc)

            // // tags
            // let tagcontainer = document.createElement('div');
            // tagcontainer.className = 'tagContainer';
            let tg = data.items[0].snippet.tags;
            // tg.forEach(element =>{
            //     let tagspan = document.createElement('span');
            //     tagspan.textContent = element;
            //     tagcontainer.appendChild(tagspan);
            // })
            // output.appendChild(tagcontainer);

            videoData = { imgURL, tit, des, tg };

            // description button
            let descbtn = document.createElement('button');
            descbtn.setAttribute('onclick', `showDesc(${i})`);
            descbtn.textContent = "Show Description";
            output.appendChild(descbtn)

            // tag button
            let tagbtn = document.createElement('button');
            tagbtn.setAttribute('onclick', `showTags(${i})`);
            tagbtn.textContent = "Show Tags";
            output.appendChild(tagbtn)


            dataContainer.appendChild(output)

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    return videoData;
}


