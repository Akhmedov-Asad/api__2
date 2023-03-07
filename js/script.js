const apiKey = 'f847e9a741477730ef4b95de33d4dc88';

const baseUrl = 'https://api.themoviedb.org/3/';

const imagesUrl = 'https://image.tmdb.org/t/p/w500';

// const url = `${baseUrl}discover/movie?api_key=${apiKey}`;

const fragment = document.createDocumentFragment();

const loaderConteiner = document.querySelector('.loader-container');
const loader = document.createElement('div');
loader.classList.add('loader');
loaderConteiner.appendChild(loader);

let currentPage = 1;

async function myAsyncFunc() {
    const searchTerm = document.querySelector("#search").value;

    let url;

    if (searchTerm) {
        url = `${baseUrl}search/movie?api_key=${apiKey}&query=${searchTerm}`
    } else {
        url = `${baseUrl}discover/movie?api_key=${apiKey}&page=${currentPage}`;
    }

    try {
        const responce = await fetch(url);
        const data = await responce.json();

        let totalPages = data.total_pages > 5 ? 10 : data.totalPages;
        const movie_container = document.querySelector('.movie-container');

        movie_container.innerHTML = '';
        if (data.results.length === 0) {
            const message = document.querySelector('.not-found');
            message.textContent = 'Фильм не найден'
        } else {
            data.results.map((movie) => {

                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card')

                const movieImage = document.createElement('img');
                movieImage.src = `${imagesUrl}${movie.backdrop_path}`
                movieImage.alt = movie.title;

                const movieTitle = document.createElement('h3');
                movieTitle.textContent = movie.title;

                const movieRelease = document.createElement('span');
                movieRelease.textContent = `Relesed: ${movie.release_date}`;



                fragment.appendChild(movieImage);
                fragment.appendChild(movieTitle);
                fragment.appendChild(movieRelease);

                movieCard.appendChild(fragment)
                movie_container.appendChild(movieCard);

            })
            const paginationWrapper = document.querySelector('.pagination-wrapper');
            paginationWrapper.innerHTML = "";

            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    const button = document.createElement('button');
                    button.innerText = i;
                   if(currentPage === i){
                    button.classList.add('active');
                   }
                    button.addEventListener('click', () => {
                       currentPage = i;
                       myAsyncFunc();
                    })
                    paginationWrapper.appendChild(button);
                }
            }

        }

    } catch (error) {
        console.error(error.message);
    } finally {

        const loader = document.querySelector('.loader');
        if (loader) {
            loaderConteiner.remove();
        }
    }
}
const searchInput = document.querySelector("#search");
const btn = document.querySelector('#searchBtn');

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        myAsyncFunc();
    }
});

btn.addEventListener('click', () => {
    currentPage = 1;
    myAsyncFunc();
});

myAsyncFunc();