const GET_EXCHANGE_API = 'http://localhost:3000/exchange/find';

const token = localStorage.getItem("accessToken");

function loadExchange(data) {
  const container = document.getElementById('container-exchange');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p class="text text_default" style="margin-left: 2vw">Нет возможных обменов</p>';
    return;
  }
  data.forEach(user => {
    const wantedBooks = user.books_i_can_give.split('+');
    var wantedHTML = '';
    if (wantedBooks.length === 0) {
      wantedHTML = '<p class="text text_default">От вас ничего не нужно</p>';
    } else {
      wantedBooks.forEach(book => {
        wantedHTML += `<p class="text text_default">${book}</p>`;
      });
    }

    const ownBooks = user.books_i_can_receive.split('+');
    var ownHTML = '';
    if (ownBooks.length === 0) {
      ownHTML = '<p class="text text_default">Вам ничего не нужно</p>';
    } else {
      ownBooks.forEach(book => {
        ownHTML += `<p class="text text_default">${book}</p>`;
      });
    }

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
  console.log(data);
}

fetch(GET_EXCHANGE_API, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
    if (!response.ok) {
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