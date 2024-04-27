// Handle showing of messages when result is not present
isShowMessage = (message = '', flag) => {
    document.querySelector('.no-result').innerHTML = message;
    document.querySelector('.no-result').style.display = flag ? 'block' : 'none';
}

// Hanlde loader based on flag
isShowLoader = (flag) => {
    document.querySelector('.app-loader').style.display = flag ? 'block' : 'none';
}

// Takes the imput and make the api request to get results
searchAlbum = (field) => {
    const list = document.querySelector('ul');
    if (list) document.getElementById('result').removeChild(list); 
    // clears the prev results
    const searchValue = field.value.trim();
    if (!searchValue.length) {
        isShowMessage('Search for results', true);
    }
    else {
        isShowMessage('', false);
        isShowLoader(true);
        // create the URL   
        const apiURL = `https://ws.audioscrobbler.com/2.0/?method=album.search&format=json&limit=30&api_key=4d59bc769f0132b5632208ba342d219c&album=${field.value}`
        // Make a GET request using the Fetch API
        fetch(apiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(albumData => {
                const data = albumData?.results?.albummatches?.album;
                showResult(data);
                isShowLoader(false);
            })
            .catch(() => {
                isShowMessage('Failed to load the result', true);
                isShowLoader(false);
            });
    }
}

// Shows the Result in list
showResult = (data) => {
    if (!data.length) {
        isShowMessage('No Result Found', true);
    } else {
        isShowMessage('', false);
        const list = document.createElement('ul');
        document.getElementById('result').appendChild(list);
        data.forEach(album => {
            const getImg = Object.values(album.image[2]);
            const markup = `<li class="album-details">
              <a target="_blank" rel="noreferrer" href=${album.url} class="album-img-link">
                  <img class="album-img" src="${getImg[0]}">   
              </a>
              <div class="album-info">  
                <a target="_blank" rel="noreferrer" href=${album.url} class="album-name-link"">
                  ${album.name}
                </a>
               <span class="album-artist">${album.artist}</span>
              </div>
            </li>`;
            document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
        });
    }
}