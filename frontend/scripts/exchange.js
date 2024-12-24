const GET_EXCHANGE_API = 'http://localhost:3000/exchange/find';

const token = localStorage.getItem("accessToken");

function getBooksHTML(Books, text){
  if (Books !== null && Books.includes('+')) {
    Books = Books.split('+');
  }
  var HTML = '';
  if (Books === null || Array.isArray(Books) && Books.length === 0) {
    HTML = `<p class="text text_default">${text}</p>`;
  } else if (Array.isArray(Books) && Books.length > 1){
    Books.forEach(book => {
      HTML += `<p class="text text_default">${book}</p>`;
    });
  } else {
    HTML = `<p class="text text_default">${Books}</p>`;
  };
  return HTML;
}

function loadExchange(data) {
  const container = document.getElementById('container-exchange');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p class="text text_default" style="margin-top: 3vw">Нет возможных обменов</p>';
    return;
  }
  data.forEach(user => {
    let wantedBooks = user.books_i_can_give;
    const wantedHTML = getBooksHTML(wantedBooks, 'От вас ничего не нужно');

    let ownBooks = user.books_i_can_receive;
    const ownHTML = getBooksHTML(ownBooks, 'Вам ничего не нужно');

    const userRow = document.createElement('div');
    userRow.className = 'row';
    userRow.innerHTML = `
      <div class="row__profile">
        <button class="text text_nickname link-button" data-id="${user.nickname}">${user.nickname}</button>
        <p class="text text_default">${user.country_name}, ${user.city_name}</p>
        <p class="text text_default">${user.email}</p>
        <p class="text text_default">Совершено обменов: ${user.exchange_count}</p>
      </div>
      <div class="row__books">
        ${wantedHTML}
      </div>
      <div class="row__books">
        ${ownHTML}
      </div>
    `;
    container.appendChild(userRow);
  });

  const linkButtons = document.querySelectorAll('.link-button');
  linkButtons.forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem("user", button.dataset.id);
      window.location.href = './profile.html';
    });
  });
}

fetch(GET_EXCHANGE_API, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
    if (!response.ok) {
      document.getElementById('container-exchange').innerHTML = '<p class="text text_default" style="margin-top: 3vw">Не удалось получить информацию об обменах.</p>';
      throw new Error("Failed to load exchange.");
    }
    return response.json();
  })
  .then((data) => {
    loadExchange(data[0]);
  })
  .catch((error) => {
    console.log(error);
  });