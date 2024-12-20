document.getElementById('open_add-exchange').addEventListener('click', (event) => {
  document.getElementById('form_add-exchange').style.display = 'flex';
  document.getElementById('form_add-exchange').style.position = 'fixed';
  document.body.style.overflow = "hidden";
});

document.getElementById('close_add-exchange').addEventListener('click', (event) => { 
  document.getElementById('form_add-exchange').style.display = 'none';
  document.body.style.overflow = "auto";
});

document.getElementById('open_add-wanted').addEventListener('click', (event) => {
  document.getElementById('form_add-wanted').style.display = 'flex';
  document.getElementById('form_add-wanted').style.position = 'fixed';
  document.body.style.overflow = "hidden";
});

document.getElementById('close_add-wanted').addEventListener('click', (event) => { 
  document.getElementById('form_add-wanted').style.display = 'none';
  document.body.style.overflow = "auto";
});

document.getElementById('open_add-mybook').addEventListener('click', (event) => {
  document.getElementById('form_add-mybook').style.display = 'flex';
  document.getElementById('form_add-mybook').style.position = 'fixed';
  document.body.style.overflow = "hidden";
});

document.getElementById('close_add-mybook').addEventListener('click', (event) => { 
  document.getElementById('form_add-mybook').style.display = 'none';
  document.body.style.overflow = "auto";
});

// exit from the system, needs to update unauth
document.getElementById('button_exit').addEventListener('click', (event) => {
  window.location.href = './index.html';
});