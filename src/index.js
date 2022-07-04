import fetchImages from './js/fetchImagesAPI';
import axios from 'axios';
import { Notify } from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchFormEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input[name="searchQuery"]'),
  btnLoadMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const { searchFormEl, inputEl, btnLoadMore, gallery } = refs;

let page = 1;
let name = '';

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

searchFormEl.addEventListener('submit', onFormSubmit);
btnLoadMore.addEventListener('click', onBtnClick);

function onFormSubmit(e) {
  e.preventDefault();
  name = e.target[0].value.trim();
  e.target[0].value = '';
  clearGallery();

  fetchImages(name, page).then(img => {
    if (img.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    successLoadImg(img.totalHits);
    renderMarkup(img.hits);
    checkImg(img.totalHits);
  });
  lightbox.refresh();
}

async function checkImg(number) {
  const num = await number;

  if (gallery.childElementCount >= num) {
    btnLoadMore.classList.add('disabled');
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    btnLoadMore.classList.remove('disabled');
  }
}

function renderMarkup(arr) {
  const markup = arr
    .map(el => {
      return `
            <div class='photo-card'>
                <a href='${el.largeImageURL}'>
                    <img src='${el.webformatURL}' alt='${el.tags}' loading='lazy' />
                </a>
                <div class='info'>
                    <p class='info-item'>
                    <b>Likes</b>
                    ${el.likes} ❤️
                    </p>
                    <p class='info-item'>
                    <b>Views</b>
                    ${el.views} 👀
                    </p>
                    <p class='info-item'>
                    <b>Comments</b>
                    ${el.comments} 📥
                    </p>
                    <p class='info-item'>
                    <b>Downloads</b>
                    ${el.downloads} ✅
                    </p>
                </div>
            </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function onBtnClick() {
  page += 1;

  fetchImages(name, page).then(img => {
    renderMarkup(img.hits);
    checkImg(img.totalHits);
  });
}

function clearGallery() {
  gallery.innerHTML = '';
}

function successLoadImg(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}
