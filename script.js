function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function signup() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('emailSignup').value;
  const password = document.getElementById('passwordSignup').value;

  if (!isValidEmail(email)) {
    alert('Por favor, insira um endereço de e-mail válido.');
    return;
  }

  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
  const emailExists = existingUsers.some(user => user.email === email);

  if (emailExists) {
    alert('Este email já está cadastrado. Tente outro.');
  } else {
    const newUser = { name, email, password };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert('Conta criada com sucesso!');

    localStorage.setItem('logged', newUser.email);
    window.location.href = 'tasks.html';
  }
}

function login(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const logged = users.find(user => user.email === email && user.password === password);

  if (logged) {
    alert('Login bem-sucedido!');
    localStorage.setItem('logged', logged.email);
    window.location.href = 'tasks.html';
  } else {
    alert('Credenciais inválidas. Verifique seu email e senha.');
  }
}
