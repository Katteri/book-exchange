const ADD_EXCHANGE_API = 'http://localhost:3000/exchange/add';

async function addExchange(event) {
  event.preventDefault();
  const form = event.target;
  
  const exchange = {
    get_nickname: form.nickname.value.trim(),
    isbn: form.exchange_isbn.value,
  };

  try {
    const response = await fetch(ADD_EXCHANGE_API, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
       },
      body: JSON.stringify(exchange),
    });
    if (response.ok) {
      alert('Обмен успешно добавлен!');
      form.reset();
      document.getElementById('form_add-exchange').style.display = 'none';
      document.body.style.overflow = "auto";
      location.reload(); // maybe it's better to call a function loadUserInfo которая фечит страницу
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData.message);
    }
  } catch (error) {
    console.error('Error to add exchange:', error);
  }
}

document.getElementById('exchange-add').addEventListener('submit', addExchange);