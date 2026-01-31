document.getElementById('adminLoginForm')?.addEventListener('submit', e => {
  e.preventDefault();

  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const msg = document.getElementById('loginMsg');

  // TEMP credentials
  if (user === 'admin' && pass === 'admin123') {
    msg.style.color = 'green';
    msg.innerText = 'Login successful';
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  } else {
    msg.style.color = 'red';
    msg.innerText = 'Invalid credentials';
  }
});


