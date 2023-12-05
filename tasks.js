document.addEventListener('DOMContentLoaded', function () {
    const logged = localStorage.getItem('logged');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === logged);
  
    if (user) {
      document.getElementById('username').innerText = user.name;
    } else {
      window.location.href = 'index.html';
    }
  
  });

function createTask() {
    const title = document.getElementById('title').value;
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const endDate = document.getElementById('endDate').value;
    const endTime = document.getElementById('endTime').value;
    const description = document.getElementById('description').value;



    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const logged = localStorage.getItem('logged');
    const newTask = {
        title,
        startDate,
        startTime,
        endDate,
        endTime,
        description,
        status: 'Pendente', 
        user: logged 
    };

    existingTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(existingTasks));

    document.getElementById('taskForm').reset();
}



function logout() {
    localStorage.removeItem('logged');
    window.location.href = 'index.html';
}