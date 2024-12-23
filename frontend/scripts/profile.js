const user = localStorage.getItem("user");
const USER_API = `http://localhost:3000/users/${user}`;

const GET_OWN_API = `http://localhost:3000/book/owned/get/${user}`;
const GET_WANTED_API = `http://localhost:3000/book/wanted/get/${user}`;

const conditionNorm = {
  'новая': 'new',
  'как новая': 'like_new',
  'хорошее': 'good',
  'приемлемое': 'acceptable',
  'плохое': 'bad'
};

function getConditionNorm(value) {
  const key = Object.keys(conditionNorm).find(k => conditionNorm[k] === value);
  return key;
}

function getNormalName(name) {
  name = name.replace(' No last name', '');
  name = name.replace('No name', '');
  if (name.length === 0) {
    name = 'Нет имени';
  }
  return name;
}

async function getWantedBooks() {
  try {
    fetch(GET_WANTED_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
          throw new Error("Failed to load wanted books.");
        }
        return response.json();
      })
      .then((data) => {
        loadWantBooks(data);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error('Error to load wanted books:', error);
  }
}

async function getOwnBooks() {
  try {
    fetch(GET_OWN_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
          throw new Error("Failed to load wanted books.");
        }
        return response.json();
      })
      .then((data) => {
        loadOwnBooks(data);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error('Error to load wanted books:', error);
  }
}

function loadWantBooks(books) {
  const container = document.getElementById('book-container-want');
  container.innerHTML = '';

  if (books.length === 0) {
    container.innerHTML = '<p class="text text_default" style="margin-left: 2vw">Нет книг</p>';
    return;
  }
  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'card';
    bookCard.innerHTML = `
      <h4 class="card__title">${book.title}</h4>
      <div class="card__system">
        <div>
          <p class="card__isbn">ISBN: ${book.isbn}</p>
          <p class="card__series">${book.series_name || ''}</p>
        </div>
        <p class="card__language">${book.language.toUpperCase()}</p>
      </div>
      <p class="text">${book.author_name}</p>
      <p class="text">${book.category_name}</p>
      <p class="text">${(book.publish_date)? book.publish_date.slice(0, 4) : ''}</p>
      <button id='delete-wanted' class="button button_delete" data-id="${book.isbn}">удалить</button>
    `;
    container.appendChild(bookCard);
  });

  const deleteButtons = document.querySelectorAll('.button_delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => deleteWantedBook(button.dataset.id));
  });
}

function loadOwnBooks(books) {
  const container = document.getElementById('book-container-own');
  container.innerHTML = '';

  if (books.length === 0) {
    container.innerHTML = '<p class="text text_default" style="margin-left: 2vw">Нет книг</p>';
    return;
  }
  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'card';
    bookCard.innerHTML = `
      <h4 class="card__title">${book.title}</h4>
      <div class="card__system">
        <div>
          <p class="card__isbn">ISBN: ${book.isbn}</p>
          <p class="card__series">${book.series_name || ''}</p>
        </div>
        <p class="card__language">${book.language.toUpperCase()}</p>
      </div>
      <p class="text">${book.author_name}</p>
      <p class="text">${book.category_name}</p>
      <p class="text">${(book.publish_date)? book.publish_date.slice(0, 4) : ''}</p>
      <p class="text">Состояние: ${getConditionNorm(book.condition)}</p>
      <button id='delete-own' class="button button_delete" data-id="${book.isbn}">удалить</button>
    `;
    container.appendChild(bookCard);
  });

  const deleteButtons = document.querySelectorAll('.button_delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => deleteOwnBook(button.dataset.id));
  });
}

function loadUserInfo(data) {
  document.getElementById('user_nickname').textContent = data.nickname;
  document.getElementById('user_own').textContent = `Книг отдает: ${data.book_owner_count}`;
  document.getElementById('user_want').textContent = `Книг ищет: ${data.book_wanted_count}`;
  document.getElementById('user_exchange').textContent = `Всего обменов: ${data.exchange_count}`;
  document.getElementById('user_name').textContent = getNormalName(data.name);
  document.getElementById('user_email').textContent = data.email;
  document.getElementById('user_country').textContent = data.country;
  document.getElementById('user_city').textContent = data.city;
}

fetch(USER_API, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
}).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load user's page.");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data[0]);
    loadUserInfo(data[0]);
    getWantedBooks();
    getOwnBooks();
  })
  .catch((error) => {
    console.log(error);
  });
