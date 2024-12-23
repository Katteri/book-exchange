const SIGNUP_API = 'http://localhost:3000/auth/signup'
const LOGIN_API = 'http://localhost:3000/auth/login'

async function getSignup(event) {
  event.preventDefault();
  const form = event.target;

  const newUser = {
    nickname: form.nickname.value.toLowerCase(),
    first_name: form.first_name.value.trim() || null,
    last_name: form.last_name.value.trim() || null,
    country_name: form.country_name.value.trim(),
    city_name: form.city_name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value.trim(),
  };
  
  try {
    const response = await fetch (SIGNUP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      alert('Вы успешно зарегистрировались! Теперь можно входить!');
      form.reset();
      document.getElementById('form_sign-in').style.display = 'none';
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData.message);
    }
  } catch (error) {
    console.error('Error adding new user:', error);
  }
}

async function getLogin(event) {
  event.preventDefault();
  const form = event.target;

  const user = {
    nickname: form.nickname_login.value.toLowerCase(),
    password: form.password_login.value,
  };

  try {
    const response = await fetch (LOGIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      alert('Вы успешно вошли!');
      form.reset();
      // переход на страницу профиля пользователя
      window.location.href = './myprofile.html';
      
    } else {
      alert('Неверный логин или пароль!');
      const errorData = await response.json();
      console.error('Error:', errorData.message);
    }
  } catch(error) {
    console.error('Error log in user:', error);
  }
}

document.getElementById('sign-in').addEventListener('submit', (event) => {
  const form = event.target;

  if (!form.checkValidity()) {
    event.preventDefault();
    form.querySelectorAll(':invalid').forEach((input) => {
      input.reportValidity();
    });
  } else {
    getSignup(event);
  }
});

document.getElementById('log-in').addEventListener('submit', getLogin);