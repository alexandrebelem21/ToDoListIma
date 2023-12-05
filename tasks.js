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

function loadTasks(loggedInUser) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];


    const taskTable = document.getElementById('taskList');
    taskTable.innerHTML = '';

    tasks.forEach(task => {
        if (task.user === loggedInUser) {
            const row = taskTable.insertRow();
    
            const titleCell = row.insertCell(0);
            titleCell.innerHTML = `<a>${task.title}</a>`;
    
               const startDateTime = new Date(`${task.startDate}T${task.startTime}`);
        const startCell = row.insertCell(1);
        startCell.textContent = startDateTime.toLocaleString();
       
    
            const endDateTime = new Date(`${task.endDate}T${task.endTime}`);
            const endCell = row.insertCell(2);
            endCell.textContent = endDateTime.toLocaleString();
    
            const statusCell = row.insertCell(3);
            statusCell.innerHTML = `<span class="badge bg-primary">${task.status}</span>`;
    
            const editCell = row.insertCell(4);
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-warning btn-sm';
            editButton.innerText = 'Editar';
           
            editCell.appendChild(editButton);
    
            

        }
    });
    
    
}