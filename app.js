'use strict';

import { fetchData } from './fetchData.js';

const form = document.querySelector('form');
const searchInput = document.getElementById('search');
const clearBtn = document.querySelector('.clear');
const searchResultsEl = document.getElementById('searchResults');
const loader = document.querySelector('.loader');

let limit = 10;
let current = 0;
let next = 0;
let totalSearchResults = [];
let observer = null;

const observerFunc = () => {
  observer = new IntersectionObserver(
    (entries) => {
      const isVisible = entries[0].isIntersecting;

      if (isVisible) {
        loader.classList.add('show');

        setTimeout(() => {
          displayQuery();
          current += 1;
          next = current * 10;
          limit += 10;
        }, 1000);
      } else {
        loader.classList.remove('show');
      }
    },
    {
      threshold: 1,
    }
  );

  observer.observe(loader);
};

const displayQuery = (data) => {
  const searches = totalSearchResults.slice(next, limit);
  let displayArr = data?.length === 0 ? data : searches;

  if (data?.length === 0) {
    searchResultsEl.innerHTML = '';
    totalSearchResults = [];
    loader.classList.remove('show');
    observer.unobserve(loader);
  }

  displayArr.forEach((value) => {
    searchResultsEl.innerHTML += `<div class="resultItem">
			<div class="resultTitle">
				<img
					src="${value.thumbnail ? value.thumbnail.source : './img/no-img.png'}"
					alt="${value.title}"
					width="50"
				/>
				<a href="https://en.wikipedia.org/?curid=${value.pageid}" target="_blank"
					>${value?.title}</a
				>
			</div>
			<div class="resultContent">
				<div class="resultText">
					<p class="resultDescription">
						${value.extract ? value.extract.substr(0, 50) + '...' : 'No Description...'}
					</p>
				</div>
			</div>
		</div>`;
  });
};

const submitFunc = async (e) => {
  e.preventDefault();

  observerFunc();

  const searchValue = searchInput.value;

  if (!searchValue.trim()) return;

  try {
    const query = await fetchData(searchValue);
    const values = Object.values(query);
    totalSearchResults = [...values];

    displayQuery();
  } catch (error) {
    console.log(error);
  }
};

const addClear = (e) => {
  const value = e.target.value.trim();
  if (value) clearBtn.classList.add('flex');
  else clearBtn.classList.remove('flex');
};

const clearInput = () => {
  searchInput.value = '';
  clearBtn.classList.remove('flex');

  displayQuery([]);
};

//////////////////////////////////////////
searchInput.addEventListener('keyup', addClear);
clearBtn.addEventListener('click', clearInput);
form.addEventListener('submit', submitFunc);
