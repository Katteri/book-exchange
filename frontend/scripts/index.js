document.getElementById('open-log-in').addEventListener('click', (event) => {
  document.getElementById('form_log-in').style.display = 'flex';
});

document.getElementById('open-sign-in').addEventListener('click', (event) => { 
  document.getElementById('form_sign-in').style.display = 'flex';
});

document.getElementById('close_log-in').addEventListener('click', (event) => { 
  document.getElementById('form_log-in').style.display = 'none';
});

document.getElementById('close_sign-in').addEventListener('click', (event) => { 
  document.getElementById('form_sign-in').style.display = 'none';
});