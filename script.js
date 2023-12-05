function signup() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('emailSignup').value;
  const password = document.getElementById('passwordSignup').value;



  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

  const emailExists = existingUsers.some(user => user.email === email);

  if (emailExists) {
    alert('Este email já está cadastrado. Tente outro.');
  } else {
    const newUser = { name, email, password };
    existingUsers.push(newUser);

    localStorage.setItem('users', JSON.stringify(existingUsers));
    alert('Conta criada com sucesso!');
    
    window.location.href = 'tasks.html';
  }
}