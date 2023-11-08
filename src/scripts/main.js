import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { searchPhotos } from "./api";

let pages = 1;
let per_pages = 50;

let SimpleLightboxGallery = {};

const photoSearch = {
  searchForm: document.querySelector("#search-photo"),
  input: document.querySelector("[name='searchQuery']"),
  searchResult: document.querySelector(".search-result"),
  loader: document.querySelector("span"),
};

photoSearch.searchForm.addEventListener("submit", formSubmit);

async function formSubmit(e) {
  e.preventDefault();

  const validInputSearch = photoSearch.input.value.trim();

  if (validInputSearch === "") {
    Notify.warning("Field must be fill", {
      position: "right-top",
      timeout: 3000,
    });

    return;
  }

  if (!validInputSearch) {
    photoSearch.loader.classList.add("loader");
  }

  try {
    photoSearch.searchResult.innerHTML = "";

    const response = await searchPhotos(validInputSearch, pages, per_pages);
    if (!response.data.total) {
      Notify.failure(
        "Sorry, there are no images matching your search query. Please try again.",
        {
          position: "right-top",
          timeout: 3000,
        }
      );
      photoSearch.searchResult.innerHTML = `<p class="search-app-not-found">Oops! Something wrong! Picture not found</p>`;
      return;
    }
    if (!response.data.total) {
      photoSearch.loader.classList.remove("loader");
    }
    await markUpSearch(response.data.hits);
    Notify.success(`We found ${response.data.totalHits} photos`, {
      position: "right-top",
      timeout: 3000,
    });
    if (validInputSearch) {
      photoSearch.loader.classList.remove("loader");
    }

    SimpleLightboxGallery = new SimpleLightbox(".search-result a", {
      doubleTapZoom: 2,
      fadeSpeed: 500,
    });
    SimpleLightboxGallery.refresh();
  } catch (error) {
    console.log(error);
    Notify.failure("Oops! You are offline. Try connection again", {
      position: "right-top",
      timeout: 3000,
    });
    return;
  }
}

// Markup
function markUpSearch(arr) {
  return arr.forEach(
    ({ webformatURL, largeImageURL, tags, views, comments, downloads }) => {
      const markUp = `
          <li class="photo-card-search-photo-list-item">
              <a class="card-search-photo-link" href="${largeImageURL}" alt="${tags}" >
                  <img class="search-photo-pictures" src="${webformatURL}" alt="${tags}" loading="lazy"/>
              </a>
                  <ul class="info-search-photo-list">
                      <li class="info-search-photo-list-item">
                          <p class="info-search-photo-item">Views ${views}</p>
                      </li>
                      <li class="info-search-photo-list-item">
                          <p class="info-search-photo-item">Comments ${comments}</p>
                      </li>
                      <li class="info-search-photo-list-item">
                          <p class="info-search-photo-item">Downloads ${downloads}</p>
                      </li>
                  </ul>
            </li>`;
      photoSearch.searchResult.insertAdjacentHTML("beforeend", markUp);
    }
  );
}
